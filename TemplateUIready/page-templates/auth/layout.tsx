import SircleAuthLayout from '@/components/layouts/AuthLayout/SircleAuthLayout'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <PostLoginLayout>
      <SircleAuthLayout>{children}</SircleAuthLayout>
    </PostLoginLayout>
  )
}

export default Layout
