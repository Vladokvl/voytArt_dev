'use client'

import AdaptiveCard from '@/components/shared/AdaptiveCard'
import useTranslation from '@/utils/hooks/useTranslation'

type AdminPageShellProps = {
  titleKey: string
  descriptionKey: string
}

const AdminPageShell = ({ titleKey, descriptionKey }: AdminPageShellProps) => {
  const t = useTranslation('admin.pages')

  return (
    <AdaptiveCard>
      <h3 className="heading-text mb-2">{t(titleKey)}</h3>
      <p className="text-gray-600 dark:text-gray-400">{t(descriptionKey)}</p>
    </AdaptiveCard>
  )
}

export default AdminPageShell
