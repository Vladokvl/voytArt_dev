import useAuthority from '@/utils/hooks/useAuthority'
import type { CommonProps } from '@/@types/common'

interface AuthorityCheckProps extends CommonProps {
  userAuthority: string[]
  authority: string[]
}

const AuthorityCheck = (props: AuthorityCheckProps) => {
  const { authority = [], children } = props

  const { hasAuthority } = useAuthority()
  const roleMatched = hasAuthority(authority)

  return <>{roleMatched ? children : null}</>
}

export default AuthorityCheck
