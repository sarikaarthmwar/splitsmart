export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  default_currency: string
  timezone: string
  created_at: string
  updated_at: string
}

export type ProfileUpdate = Pick<Profile, 'display_name' | 'avatar_url' | 'default_currency' | 'timezone'>
