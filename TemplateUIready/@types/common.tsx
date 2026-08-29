import type { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
  id?: string
  className?: string
  children?: ReactNode
  style?: CSSProperties
  footer?: boolean
}

export type TableQueries = {
  total?: number
  pageIndex?: string
  pageSize?: string
  query?: string
  order?: 'asc' | 'desc' | ''
  sortKey?: string | number
}

export type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
