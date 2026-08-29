'use client'

import { usePathname } from '@/i18n/navigation'
import { protectedRoutes } from '@/configs/routes.config'

export const useRouteAuthority = () => {
  const pathname = usePathname()
  const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname

  // Find exact route in protectedRoutes configuration
  const exactRoute = protectedRoutes[normalizedPath]
  if (exactRoute) {
    return exactRoute.authority
  }

  const inputSegments = normalizedPath.split('/').filter(Boolean)

  // Fallback to dynamic protected route matching (e.g. /admin/stores/edit/[id])
  for (const [routePath, route] of Object.entries(protectedRoutes)) {
    if (!route.dynamicRoute) continue

    const routeSegments = routePath.split('/').filter(Boolean)
    if (routeSegments.length !== inputSegments.length) continue

    const isMatch = routeSegments.every((segment, index) => {
      if (segment.startsWith('[') && segment.endsWith(']')) {
        return true
      }

      return segment === inputSegments[index]
    })

    if (isMatch) {
      return route.authority
    }
  }

  return []
}
