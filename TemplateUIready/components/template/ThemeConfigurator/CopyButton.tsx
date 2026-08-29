'use client'

import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import useTranslation from '@/utils/hooks/useTranslation'
import { themeConfig } from '@/configs/theme.config'
import useTheme from '@/utils/hooks/useTheme'

const CopyButton = () => {
  const t = useTranslation('common')
  const theme = useTheme(state => state)

  const handleCopy = () => {
    const config = {
      ...themeConfig,
      ...theme,
      layout: {
        type: theme.layout.type,
        sideNavCollapse: theme.layout.sideNavCollapse,
      },
      panelExpand: false,
    }

    navigator.clipboard.writeText(`
            
export const themeConfig: ThemeConfig = ${JSON.stringify(config, null, 2)}
`)

    toast.push(
      <Notification title={t('copySuccess')} type="success">
        {t('themeConfigReplaceMessage')}
      </Notification>,
      {
        placement: 'top-center',
      }
    )
  }

  return (
    <Button block variant="solid" onClick={handleCopy}>
      {t('copyConfig')}
    </Button>
  )
}

export default CopyButton
