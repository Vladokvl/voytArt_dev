export type AdminInvitationsOverview = {
  totalSent: number
  accepted: number
  pending: number
  conversionRate: number
  avgDelaySeconds: number | null
}

export type AdminInvitationsOverviewResponse = {
  status: 'success'
  data: AdminInvitationsOverview
}

export type AdminInvitationsDailyPoint = {
  date: string
  count: number
}

export type AdminInvitationsDailyResponse = {
  status: 'success'
  data: AdminInvitationsDailyPoint[]
}

export type AdminInvitationsTopInviter = {
  userId: string
  name: string | null
  maskedCode: string | null
  sent: number
  accepted: number
  conversionRate: number
}

export type AdminInvitationsTopInvitersResponse = {
  status: 'success'
  data: AdminInvitationsTopInviter[]
}

export type AdminInvitationsChainNode = {
  userId: string
  name: string | null
  maskedCode: string | null
  invitedById: string | null
  inviterName: string | null
  depth: number
  directInvitees: number
  invitationsSent: number
  invitationsAccepted: number
}

export type AdminInvitationsChainsResponse = {
  status: 'success'
  data: AdminInvitationsChainNode[]
}

export type AdminInvitationsDashboardData = {
  overview: AdminInvitationsOverview
  daily: AdminInvitationsDailyPoint[]
  topInviters: AdminInvitationsTopInviter[]
  chains: AdminInvitationsChainNode[]
}
