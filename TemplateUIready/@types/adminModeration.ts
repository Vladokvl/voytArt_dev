export type UserReportStatus = 'pending' | 'resolved' | 'dismissed'

export type AdminUserReport = {
  id: string
  reason: string
  details: string | null
  status: UserReportStatus
  adminNote: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  reporter: { id: string; name: string | null; email: string | null }
  reportedUser: {
    id: string
    name: string | null
    email: string | null
    status: string
  }
}

export type AdminReportsListResponse = {
  status: 'success'
  data: {
    reports: AdminUserReport[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export type AdminRateLimits = {
  ttlMs: number
  maxRequests: number
}

export type AdminRateLimitsResponse = {
  status: 'success'
  data: AdminRateLimits
}

export type AdminAuditLog = {
  id: string
  actorType: string
  actorId: string | null
  action: string
  targetType: string | null
  targetId: string | null
  metadata: unknown
  ipAddress: string | null
  createdAt: string
}

export type AdminAuditLogsListResponse = {
  status: 'success'
  data: {
    logs: AdminAuditLog[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}
