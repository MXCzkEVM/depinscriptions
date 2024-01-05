import { useTranslation } from 'react-i18next'
import { Refresh as IconRefresh } from '@ricons/ionicons5'
import { Icon } from './Icon'
import { useEventBus } from '@/hooks'

export interface RefreshProps {
  event?: string
  onClick?: any
  hideText?: boolean
}

export function Refresh(props: RefreshProps) {
  const { t } = useTranslation()
  const { emit: reload } = useEventBus(props.event || 'reload:page')

  return (
    <div className="flex gap-2 items-center cursor-pointer" onClick={props.onClick || reload}>
      {
        !props.hideText && <span className="hidden md:inline-block">{t('Refresh')}</span>
      }
      <Icon size={18}>
        <IconRefresh />
      </Icon>
    </div>
  )
}
