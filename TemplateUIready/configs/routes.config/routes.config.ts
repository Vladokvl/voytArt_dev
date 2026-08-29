import type { Routes } from '@/@types/routes'
import { ADMIN } from '@/constants/roles.constant'
import authRoute from './authRoute'
import otherRoute from './otherRoute'

export const protectedRoutes: Routes = {
  '/admin': {
    key: 'dashboard',
    authority: [ADMIN],
  },
  '/admin/users/list': {
    key: 'users',
    authority: [ADMIN],
  },
  '/admin/users/[id]': {
    key: 'usersDetails',
    authority: [ADMIN],
    dynamicRoute: true,
  },
  '/admin/invitations': {
    key: 'invitations',
    authority: [ADMIN],
  },
  '/admin/graph': {
    key: 'graph',
    authority: [ADMIN],
  },
  '/admin/scoring': {
    key: 'scoring',
    authority: [ADMIN],
  },
  '/admin/notifications': {
    key: 'notifications',
    authority: [ADMIN],
  },
  '/admin/moderation': {
    key: 'moderation',
    authority: [ADMIN],
  },
  '/admin/settings': {
    key: 'settings',
    authority: [ADMIN],
  },
}

export const publicRoutes = otherRoute

export const authRoutes = authRoute
