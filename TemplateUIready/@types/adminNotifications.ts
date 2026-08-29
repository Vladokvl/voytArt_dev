export type NotificationTriggers = {
  contactRegistered: boolean
}

export type NotificationTriggersResponse = {
  status: 'success'
  data: NotificationTriggers
}

export type NotificationHistoryItem = {
  id: string
  triggerType: string
  title: string
  body: string
  recipient: { id: string; name: string | null; email: string | null }
  contactUserId: string | null
  contactName: string | null
  deviceCount: number
  deliveredCount: number
  failedCount: number
  opened: boolean
  openedAt: string | null
  createdAt: string
}

export type NotificationHistorySummary = {
  totalSent: number
  totalDelivered: number
  totalOpened: number
  openRatePct: number
  byTrigger: {
    contactRegistered: {
      sent: number
      opened: number
      openRatePct: number
    }
  }
}

export type NotificationHistoryResponse = {
  status: 'success'
  data: {
    items: NotificationHistoryItem[]
    summary: NotificationHistorySummary
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
