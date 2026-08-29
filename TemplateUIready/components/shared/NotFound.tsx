'use client'

import React from 'react'
import NoDataFound from '@/assets/svg/NoDataFound'
import useTranslation from '@/utils/hooks/useTranslation'

type NotFoundProps = {
  message?: string
}

const NotFound = ({ message }: NotFoundProps = {}) => {
  const t = useTranslation('common')
  return (
    <div className="text-center mt-20">
      <div className="flex justify-center">
        <NoDataFound height={280} width={280} />
      </div>
      <h3 className="mt-8">{message ?? t('noDataFound')}</h3>
    </div>
  )
}

export default NotFound
