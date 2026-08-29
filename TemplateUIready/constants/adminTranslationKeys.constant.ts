/**
 * Admin translation key paths (relative to "admin" namespace).
 */
export const AdminTranslationKeys = {
  SIDEBAR_DASHBOARD: 'dashboard',
  USERS_LIST_TITLE: 'users.listTitle',
  USERS_LIST_SEARCH_PLACEHOLDER: 'users.searchPlaceholder',
  USERS_LIST_COLUMN_NAME: 'users.columns.fullName',
  USERS_LIST_COLUMN_EMAIL: 'users.columns.email',
  USERS_LIST_COLUMN_PHONE: 'users.columns.phone',
  USERS_LIST_COLUMN_ROLE: 'users.columns.role',
  USERS_LIST_COLUMN_REGISTERED_AT: 'users.columns.registeredAt',
  USERS_LIST_COLUMN_STATUS: 'users.columns.status',
  USERS_LIST_FILTER_REGISTERED_FROM: 'users.filters.registeredFrom',
  USERS_LIST_FILTER_REGISTERED_TO: 'users.filters.registeredTo',
  USERS_LIST_FILTER_STATUS: 'users.filters.status.label',
  USERS_LIST_FILTER_ALL: 'users.filters.common.all',
  USERS_LIST_FILTER_ACTIVE: 'users.filters.status.active',
  USERS_LIST_FILTER_BLOCKED: 'users.filters.status.blocked',
  USERS_LIST_FILTER_SORT_BY: 'users.filters.sortBy',
  USERS_LIST_FILTER_SORT_ORDER: 'users.filters.sortOrder',
} as const

export type AdminTranslationKey = (typeof AdminTranslationKeys)[keyof typeof AdminTranslationKeys]
