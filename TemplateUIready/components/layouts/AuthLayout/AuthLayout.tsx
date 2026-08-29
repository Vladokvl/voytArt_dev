import { lazy, useMemo, type JSX, type LazyExoticComponent } from 'react'
import type { CommonProps } from '@/@types/common'

type LayoutType = 'simple' | 'split' | 'side'

type LayoutProps = CommonProps & { tagline?: string; description?: string }

type Layouts = Record<LayoutType, LazyExoticComponent<(props: LayoutProps) => JSX.Element>>

const currentLayoutType: LayoutType = 'side'

const layouts: Layouts = {
  simple: lazy(() => import('./Simple')),
  split: lazy(() => import('./Split')),
  side: lazy(() => import('./Side')),
}

const AuthLayout = ({ children }: CommonProps) => {
  const Layout = useMemo(() => layouts[currentLayoutType], [])

  return <Layout>{children}</Layout>
}

export default AuthLayout
