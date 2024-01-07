import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'

export interface EmptyProps {
  loading?: boolean
}

export function Empty(props: EmptyProps) {
  const { t } = useTranslation()
  return (
    <div className="py-24 text-center font-bold text-xl select-none">
      {
      props.loading
        ? <LoadingButton className="scale-150" size="large" loading />
        : t('No data found')
    }
    </div>
  )
}
