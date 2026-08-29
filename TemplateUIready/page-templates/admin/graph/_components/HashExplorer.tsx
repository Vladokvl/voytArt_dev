'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { Input } from '@/components/ui'
import type { ExtendedColumnDef } from '@/components/shared/DataTable'
import useTranslation from '@/utils/hooks/useTranslation'
import { AdminGraphService } from '@/services/admin'
import type { AdminGraphHashDetail, AdminGraphHashRow } from '@/@types/adminGraph'
import AdminStaticDataTable from '../../invitations/_components/AdminStaticDataTable'
import HashStatusTag, { resolveHashContactStatus } from './HashStatusTag'

type HashExplorerProps = {
  threshold: number
  initialHash?: string | null
  onHashSelect?: (hash: string | null) => void
}

export default function HashExplorer({
  threshold,
  initialHash,
  onHashSelect,
}: HashExplorerProps) {
  const t = useTranslation('admin.graph')
  const tCommon = useTranslation('common')

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<AdminGraphHashRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedHash, setSelectedHash] = useState<string | null>(initialHash ?? null)
  const [detail, setDetail] = useState<AdminGraphHashDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const loadPage = useCallback(async () => {
    try {
      setLoading(true)
      const result = await AdminGraphService.exploreHashes({
        search: search || undefined,
        page,
        limit: 20,
        threshold,
      })
      setItems(result?.items ?? [])
      setTotal(result?.total ?? 0)
    } catch (err) {
      console.error('Failed to load hash explorer:', err)
      setItems([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, search, threshold])

  useEffect(() => {
    loadPage()
  }, [loadPage])

  useEffect(() => {
    if (initialHash) {
      setSelectedHash(initialHash)
    }
  }, [initialHash])

  useEffect(() => {
    if (!selectedHash) {
      setDetail(null)
      return
    }

    let cancelled = false

    const loadDetail = async () => {
      try {
        setDetailLoading(true)
        const result = await AdminGraphService.getHashDetail(selectedHash, threshold)

        if (!cancelled) {
          setDetail(result)
        }
      } catch (err) {
        console.error('Failed to load hash detail:', err)

        if (!cancelled) {
          setDetail(null)
        }
      } finally {
        if (!cancelled) {
          setDetailLoading(false)
        }
      }
    }

    loadDetail()

    return () => {
      cancelled = true
    }
  }, [selectedHash, threshold])

  const handleSelectHash = useCallback(
    (hash: string) => {
      setSelectedHash(hash)
      onHashSelect?.(hash)
    },
    [onHashSelect],
  )

  const columns = useMemo<ExtendedColumnDef<AdminGraphHashRow>[]>(
    () => [
      {
        header: t('columns.hash'),
        accessorKey: 'hashPreview',
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.hashPreview}</span>
        ),
      },
      {
        header: t('columns.phonebooks'),
        accessorKey: 'phonebookCount',
      },
      {
        header: t('columns.status'),
        accessorKey: 'isRegistered',
        cell: ({ row }) => (
          <HashStatusTag status={resolveHashContactStatus(row.original)} />
        ),
      },
    ],
    [t],
  )

  const totalPages = Math.max(1, Math.ceil(total / 20))

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2">
        <AdaptiveCard>
          <h4 className="heading-text mb-4">{t('hashExplorerTitle')}</h4>
          <Input
            placeholder={t('hashSearchPlaceholder')}
            value={search}
            onChange={event => {
              setSearch(event.target.value)
              setPage(1)
            }}
            className="mb-4"
          />

          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">{tCommon('loading')}</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">{t('emptyHashes')}</p>
          ) : (
            <AdminStaticDataTable
              data={items}
              columns={columns}
              pageSize={20}
              onRowClick={row => handleSelectHash(row.hash)}
            />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <button
                type="button"
                className="text-primary disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => setPage(current => Math.max(1, current - 1))}
              >
                {t('pagination.prev')}
              </button>
              <span className="text-gray-500 dark:text-gray-400">
                {t('pagination.pageOf', { page, total: totalPages })}
              </span>
              <button
                type="button"
                className="text-primary disabled:opacity-40"
                disabled={page >= totalPages}
                onClick={() => setPage(current => Math.min(totalPages, current + 1))}
              >
                {t('pagination.next')}
              </button>
            </div>
          )}
        </AdaptiveCard>
      </div>

      <AdaptiveCard>
        <h4 className="heading-text mb-4">{t('hashDetailTitle')}</h4>

        {!selectedHash && (
          <p className="text-gray-500 dark:text-gray-400">{t('hashDetailHint')}</p>
        )}

        {selectedHash && detailLoading && (
          <p className="text-gray-500 dark:text-gray-400">{tCommon('loading')}</p>
        )}

        {selectedHash && !detailLoading && detail && (
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-1">{t('detail.fullHash')}</div>
              <code className="block font-mono text-xs break-all">{detail.hash}</code>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-gray-500 dark:text-gray-400">{t('columns.phonebooks')}</div>
                <div className="font-semibold heading-text">{detail.phonebookCount}</div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400">{t('columns.status')}</div>
                <div>
                  <HashStatusTag status={resolveHashContactStatus(detail)} />
                </div>
              </div>
            </div>
            {detail.maskedCode && (
              <div>
                <div className="text-gray-500 dark:text-gray-400">{t('detail.maskedCode')}</div>
                <span className="font-mono">{detail.maskedCode}</span>
              </div>
            )}
            {detail.registeredUserId && (
              <div>
                <div className="text-gray-500 dark:text-gray-400">{t('detail.registeredUser')}</div>
                <Link
                  href={`/admin/users/${detail.registeredUserId}`}
                  className="text-primary hover:underline"
                >
                  {detail.registeredUserName || detail.registeredUserId}
                </Link>
              </div>
            )}
            <div>
              <div className="text-gray-500 dark:text-gray-400 mb-2">
                {t('detail.holders', { count: detail.holders.length })}
              </div>
              <ul className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {detail.holders.map(holder => (
                  <li key={holder.userId}>
                    <Link
                      href={`/admin/users/${holder.userId}`}
                      className="text-primary hover:underline"
                    >
                      {holder.name || holder.maskedCode || holder.userId}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </AdaptiveCard>
    </div>
  )
}
