export type AdminUserAccountStatus = 'active' | 'inactive' | 'suspended' | 'banned'

export interface AdminUserListItem {
  id: string
  name: string | null
  partialNumber: string | null
  city: string | null
  universe: string | null
  maskedCode: string | null
  signupDate: string
  createdAt: string
  status: AdminUserAccountStatus
  avatar?: string | null
  isBlocked?: boolean
}

export interface AdminUsersListData {
  users: AdminUserListItem[]
  totalUsers: number
  currentPage: number
  totalPages: number
  limit: number
}

export interface AdminUsersListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface AdminUserDevice {
  id: string
  platform: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminUserStats {
  contactsImported: number
  contactsRegistered: number
  invitationsSent: number
  invitationsConverted: number
}

export interface AdminUserDetail extends AdminUserListItem {
  email: string | null
  phone: string | null
  gender?: string | null
  jobRole?: string | null
  tags?: string[]
  otherPhones?: string[]
  note?: string | null
  country?: string | null
  industry?: string | null
  industryRole?: string | null
  address?: string | null
  socials?: { name: string; link: string }[]
  moderationReason?: string | null
  moderatedAt?: string | null
  gdprConsentAt?: string | null
  contactSyncConsentAt?: string | null
  invitationBalance?: number
  invitedById?: string | null
  stats: AdminUserStats
  lastActivityAt: string
  devices: AdminUserDevice[]
  updatedAt?: string
}

export interface AdminUsersListResponse {
  status: string
  data: AdminUsersListData
  meta: AdminUsersListMeta
}

export interface AdminUserDetailResponse {
  status: string
  data: AdminUserDetail
}

export interface AdminUserStatusData {
  id: string
  status: AdminUserAccountStatus
}

export interface AdminUserStatusResponse {
  status: string
  data: AdminUserStatusData
  message?: string
}

export type ListUsersSortBy = 'createdAt' | 'name' | 'city' | 'status' | 'accountStatus'

export type ListUsersSortOrder = 'asc' | 'desc'

export interface ListUsersParams {
  search?: string
  status?: AdminUserAccountStatus | ''
  registeredFrom?: string
  registeredTo?: string
  sortBy?: ListUsersSortBy
  sortOrder?: ListUsersSortOrder
  page?: number
  limit?: number
}
