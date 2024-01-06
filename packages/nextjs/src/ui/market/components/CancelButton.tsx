import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import { useAsyncFn } from 'react-use'
import { Order } from '@/api/index.type'
import { useAsyncCallback, useSendSatsTransaction } from '@/hooks'
import { helperWaitInscriptionHash } from '@/service'

export interface CancelButtonProps {
  data: Order
  onCancelled?: (data: any) => void
}

export function CancelButton(props: CancelButtonProps) {
  const [loading, waitInscriptionHash] = useAsyncCallback(helperWaitInscriptionHash)
  const { sendTransaction, isLoading } = useSendSatsTransaction({
    onSuccess: data => waitInscriptionHash(data.hash).then(props.onCancelled),
    to: process.env.NEXT_PUBLIC_MARKET_CONTRACT || '',
    data: {
      p: 'msc-20',
      op: 'cancel',
      hash: props.data.hash,
      tick: props.data.tick,
    },
  })
  const { t } = useTranslation()
  return (
    <LoadingButton
      loading={isLoading || loading}
      onClick={() => sendTransaction?.()}
      size="small"
      variant="outlined"
    >
      {t('Cancel')}
    </LoadingButton>
  )
}
