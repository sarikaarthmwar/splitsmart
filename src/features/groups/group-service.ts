import { supabase } from '@/lib/supabase'

export type Group = {
  id: string
  owner_id: string
  name: string
  description: string | null
  currency: string
  trip_start_date: string | null
  trip_end_date: string | null
  smart_trip_mode: boolean
  created_at: string
  updated_at: string
}

export type GroupMember = {
  group_id: string
  user_id: string
  role: 'owner' | 'member'
  joined_at: string
  profile?: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

export async function createGroup(input: {
  name: string
  currency: string
  tripStartDate?: string
  tripEndDate?: string
  smartTripMode: boolean
}) {
  const { data, error } = await supabase.rpc('create_group', {
    p_name: input.name.trim(),
    p_currency: input.currency,
    p_trip_start_date: input.tripStartDate || null,
    p_trip_end_date: input.tripEndDate || null,
    p_smart_trip_mode: input.smartTripMode,
    p_description: null,
  })

  if (error) throw new Error(error.message)
  return data as string
}

export async function listGroups() {
  const { data, error } = await supabase
    .from('groups')
    .select('id, owner_id, name, description, currency, trip_start_date, trip_end_date, smart_trip_mode, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const groups = (data ?? []) as Group[]
  if (!groups.length) return []

  const ids = groups.map((group) => group.id)
  const { data: members, error: membersError } = await supabase
    .from('group_members')
    .select('group_id, user_id, role, joined_at')
    .in('group_id', ids)

  if (membersError) throw new Error(membersError.message)

  const counts = new Map<string, number>()
  for (const member of members ?? []) counts.set(member.group_id, (counts.get(member.group_id) ?? 0) + 1)

  return groups.map((group) => ({ ...group, memberCount: counts.get(group.id) ?? 0 }))
}

export async function getGroup(groupId: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('id, owner_id, name, description, currency, trip_start_date, trip_end_date, smart_trip_mode, created_at, updated_at')
    .eq('id', groupId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as Group | null) ?? null
}

export async function listGroupMembers(groupId: string) {
  const { data, error } = await supabase
    .from('group_members')
    .select('group_id, user_id, role, joined_at')
    .eq('group_id', groupId)
    .order('joined_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as GroupMember[]
}

export function formatGroupDates(group: Group) {
  if (!group.trip_start_date && !group.trip_end_date) return 'No trip dates'
  if (group.trip_start_date && group.trip_end_date) return `${formatDate(group.trip_start_date)} – ${formatDate(group.trip_end_date)}`
  return group.trip_start_date ? `From ${formatDate(group.trip_start_date)}` : `Until ${formatDate(group.trip_end_date!)}`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}
