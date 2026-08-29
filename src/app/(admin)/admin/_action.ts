'use server'
import { signOut } from '@/auth'
import { requireAdmin } from '~/lib/admin-guard'

export async function logoutAction() {
  await requireAdmin()
  await signOut({ redirectTo: '/admin/login' })
}