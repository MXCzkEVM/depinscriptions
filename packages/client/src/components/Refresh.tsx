import { useTranslation } from 'react-i18next'
import { Refresh as IconRefresh } from '@ricons/ionicons5'
import Icon from './Icon'
import { useMittEmit } from '@/hooks/useMittEmit'

interface RefreshProps {
  event?: string
}

function Refresh(props: RefreshProps) {
  const { t } = useTranslation()
  const reload = useMittEmit(props.event || 'reload:page')

  return (
    <div className="flex gap-2 items-center cursor-pointer" onClick={reload}>
      <span>{t('Refresh')}</span>
      <Icon size={18}>
        <IconRefresh />
      </Icon>
    </div>
  )
}

export default Refresh
