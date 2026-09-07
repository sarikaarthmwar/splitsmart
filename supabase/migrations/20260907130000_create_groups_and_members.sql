create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  description text,
  currency text not null default 'INR' check (currency in ('INR','USD','EUR','GBP')),
  trip_start_date date,
  trip_end_date date,
  smart_trip_mode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint groups_trip_dates_valid check (trip_end_date is null or trip_start_date is null or trip_start_date <= trip_end_date)
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create index if not exists group_members_user_id_idx on public.group_members(user_id);
create index if not exists groups_owner_id_idx on public.groups(owner_id);

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

create or replace function public.is_group_member(p_group_id uuid, p_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.group_members where group_id = p_group_id and user_id = p_user_id);
$$;
revoke all on function public.is_group_member(uuid,uuid) from public;
grant execute on function public.is_group_member(uuid,uuid) to authenticated;

create policy "group members can view groups" on public.groups for select to authenticated using (public.is_group_member(id, auth.uid()));
create policy "users can create groups for themselves" on public.groups for insert to authenticated with check (owner_id = auth.uid());
create policy "owners can update groups" on public.groups for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners can delete groups" on public.groups for delete to authenticated using (owner_id = auth.uid());
create policy "members can view memberships" on public.group_members for select to authenticated using (public.is_group_member(group_id, auth.uid()));
create policy "owners can add members" on public.group_members for insert to authenticated with check (exists (select 1 from public.groups g where g.id = group_members.group_id and g.owner_id = auth.uid()));
create policy "owners can remove members" on public.group_members for delete to authenticated using (exists (select 1 from public.groups g where g.id = group_members.group_id and g.owner_id = auth.uid()) and group_members.user_id <> auth.uid());

create or replace function public.create_group(p_name text, p_currency text default 'INR', p_trip_start_date date default null, p_trip_end_date date default null, p_smart_trip_mode boolean default false, p_description text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_group_id uuid; v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;
  if p_name is null or char_length(trim(p_name)) = 0 then raise exception 'Group name is required'; end if;
  if p_currency not in ('INR','USD','EUR','GBP') then raise exception 'Unsupported currency'; end if;
  if p_trip_start_date is not null and p_trip_end_date is not null and p_trip_start_date > p_trip_end_date then raise exception 'Trip start date must be on or before trip end date'; end if;
  insert into public.groups(owner_id,name,description,currency,trip_start_date,trip_end_date,smart_trip_mode)
  values(v_user_id,trim(p_name),nullif(trim(coalesce(p_description,'')),''),p_currency,p_trip_start_date,p_trip_end_date,coalesce(p_smart_trip_mode,false))
  returning id into v_group_id;
  insert into public.group_members(group_id,user_id,role) values(v_group_id,v_user_id,'owner');
  return v_group_id;
end;
$$;
revoke all on function public.create_group(text,text,date,date,boolean,text) from public;
grant execute on function public.create_group(text,text,date,date,boolean,text) to authenticated;
