'use client'
import { useSearchParams } from 'next/navigation'
import { useRouter, usePathname } from '@/i18n/navigation'

const useAppendQueryParams = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onAppendQueryParams = (params: Record<string, string | number | boolean>) => {
    const updatedParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([name, value]) => {
      updatedParams.set(name, String(value))
    })

    const newQueryString = updatedParams.toString()
    router.replace(`${pathname}?${newQueryString}`)
  }

  return { onAppendQueryParams }
}

export default useAppendQueryParams
