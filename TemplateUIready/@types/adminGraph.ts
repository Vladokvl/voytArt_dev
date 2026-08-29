export type AdminGraphOverview = {
  uniqueHashes: number
  registeredHashes: number
  unregisteredHashes: number
  totalPhonebookEntries: number
  usersWithPhonebook: number
  universalContactsCount: number
  defaultUniversalThresholdPct: number
}

export type AdminGraphOverviewResponse = {
  status: 'success'
  data: AdminGraphOverview
}

export type AdminGraphHashRow = {
  hash: string
  hashPreview: string
  phonebookCount: number
  isRegistered: boolean
  isUniversal: boolean
  maskedCode: string | null
  registeredUserId: string | null
  registeredUserName: string | null
}

export type AdminGraphHashRowResponse = {
  status: 'success'
  data: AdminGraphHashRow[]
}

export type AdminGraphHashesPage = {
  items: AdminGraphHashRow[]
  total: number
  page: number
  limit: number
}

export type AdminGraphHashesPageResponse = {
  status: 'success'
  data: AdminGraphHashesPage
}

export type AdminGraphHashDetail = AdminGraphHashRow & {
  holders: AdminGraphClusterMember[]
}

export type AdminGraphHashDetailResponse = {
  status: 'success'
  data: AdminGraphHashDetail
}

export type AdminGraphClusterMember = {
  userId: string
  name: string | null
  maskedCode: string | null
}

export type AdminGraphCluster = {
  clusterId: number
  memberCount: number
  members: AdminGraphClusterMember[]
}

export type AdminGraphClusterLink = {
  sourceUserId: string
  targetUserId: string
}

export type AdminGraphClustersData = {
  clusters: AdminGraphCluster[]
  links: AdminGraphClusterLink[]
}

export type AdminGraphClustersResponse = {
  status: 'success'
  data: AdminGraphClustersData
}

export type AdminGraphDashboardData = {
  overview: AdminGraphOverview
  frequentHashes: AdminGraphHashRow[]
  clusters: AdminGraphClustersData
}
