create table if not exists public.group_invitations (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  invited_email text not null,
  invited_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint group_invitations_email check (char_length(btrim(invited_email)) between 3 and 320),
  constraint group_invitations_status check (status in ('pending','accepted','cancelled'))
);

create index if not exists group_invitations_group_id_idx on public.group_invitations(group_id);
alter table public.group_invitations enable row level security;

drop policy if exists "Members can view group invitations" on public.group_invitations;
drop policy if exists "Owners can create invitations" on public.group_invitations;
drop policy if exists "Owners can update invitations" on public.group_invitations;
create policy "Members can view group invitations" on public.group_invitations for select to authenticated using (exists (select 1 from public.group_members gm where gm.group_id = group_invitations.group_id and gm.user_id = auth.uid()));
create policy "Owners can create invitations" on public.group_invitations for insert to authenticated with check (invited_by = auth.uid() and exists (select 1 from public.groups g where g.id = group_invitations.group_id and g.owner_id = auth.uid()));
create policy "Owners can update invitations" on public.group_invitations for update to authenticated using (exists (select 1 from public.groups g where g.id = group_invitations.group_id and g.owner_id = auth.uid())) with check (exists (select 1 from public.groups g where g.id = group_invitations.group_id and g.owner_id = auth.uid()));
grant select, insert, update on public.group_invitations to authenticated;

create or replace function public.create_group_with_owner(p_name text, p_description text default null, p_currency text default 'INR', p_trip_start_date date default null, p_trip_end_date date default null, p_smart_trip_enabled boolean default false)
returns public.groups language plpgsql security invoker set search_path = public as $$
declare v_group public.groups;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if p_name is null or char_length(btrim(p_name)) = 0 then raise exception 'Group name is required'; end if;
  if p_trip_start_date is not null and p_trip_end_date is not null and p_trip_start_date > p_trip_end_date then raise exception 'Trip start date must be on or before end date'; end if;
  insert into public.groups(owner_id,name,description,currency,trip_start_date,trip_end_date,smart_trip_mode)
  values(auth.uid(),btrim(p_name),nullif(btrim(p_description),''),upper(p_currency),p_trip_start_date,p_trip_end_date,coalesce(p_smart_trip_enabled,false)) returning * into v_group;
  insert into public.group_members(group_id,user_id,role) values(v_group.id,auth.uid(),'owner');
  return v_group;
end; $$;
grant execute on function public.create_group_with_owner(text,text,text,date,date,boolean) to authenticated;
