import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import { useAsyncFn } from 'react-use'
import { Order } from '@/api/index.type'
import { useSendSatsTransaction } from '@/hooks'
import { helperWaitInscriptionHash } from '@/service'

export interface CancelButtonProps {
  data: Order
  onCancelled?: (data: any) => void
}

export function CancelButton(props: CancelButtonProps) {
  const [state, wait] = useAsyncFn(helperWaitInscriptionHash)
  const { sendTransaction, isLoading } = useSendSatsTransaction({
    data: {
      p: 'msc-20',
      op: 'cancel',
      hash: props.data.hash,
      tick: props.data.tick,
    },
    to: process.env.NEXT_PUBLIC_MARKET_CONTRACT || '',
    onSuccess: data => wait(data.hash).then(props.onCancelled),
  })
  const { t } = useTranslation()

  return (
    <LoadingButton
      loading={isLoading || state.loading}
      onClick={() => sendTransaction?.()}
      size="small"
      variant="outlined"
    >
      {t('Cancel')}
    </LoadingButton>
  )
}
