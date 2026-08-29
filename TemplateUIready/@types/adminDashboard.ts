export type AdminDashboardOverview = {
  totalUsers: number
  dau: number
  mau: number
  retentionD1: number | null
  retentionD7: number | null
  retentionD30: number | null
  totalContactsImported: number
  avgContactsPerUser: number
  usersWithImports: number
  importRate: number
}

export type AdminDashboardOverviewResponse = {
  status: 'success'
  data: AdminDashboardOverview
}

export type AdminDashboardDailySignup = {
  date: string
  count: number
}

export type AdminDashboardDailySignupsResponse = {
  status: 'success'
  data: AdminDashboardDailySignup[]
}

export type AdminDashboardData = {
  overview: AdminDashboardOverview
  dailySignups: AdminDashboardDailySignup[]
}
