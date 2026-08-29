export type AdminPlatformSettings = {
  inviteRequired: boolean
  universeTags: string[]
  networkRecalcIntervalHours: number
}

export type AdminPlatformSettingsResponse = {
  status: 'success'
  data: AdminPlatformSettings
}

export const NETWORK_RECALC_INTERVAL_OPTIONS = [6, 12, 24, 48] as const
