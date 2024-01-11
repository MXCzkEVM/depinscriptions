import { useEffect, useRef, useState } from 'react'
import { useInjectHolder } from '@overlays/react'
import { latLngToCell } from 'h3-js'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { LocationDialog, WaitIndexDialog } from '../dialog'

import { Token } from '@/api/index.type'
import { useEventBus, useSendSatsTransaction } from '@/hooks'
import { getCurrentHexagon } from '@/utils'

export interface MintButtonProps {
  token?: Token
  className?: string
}

export function MintButton(props: MintButtonProps) {
  const [hexagon, setHexagon] = useState('')
  const locked = useRef(false)
  const { t } = useTranslation()
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()

  const [holderLocationMl, openLocationDialog] = useInjectHolder(LocationDialog)
  const [holderWaitingMl, openWaitIndexDialog] = useInjectHolder(WaitIndexDialog)

  const bus = useEventBus('reload:page')

  const { isLoading: isButtonLoading, sendTransaction, isConfigFetched } = useSendSatsTransaction({
    data: {
      p: 'msc-20',
      op: 'mint',
      tick: props.token?.tick,
      amt: props.token?.limit || 0,
      hex: hexagon,
    },
    async onSuccess({ hash }) {
      await openWaitIndexDialog({ hash })
      bus.emit()
    },
  })

  async function authorize() {
    const hexagon = await getCurrentHexagon()
    setHexagon(hexagon)
  }

  async function mint() {
    if (!isConnected)
      return openConnectModal?.()
    await openLocationDialog()
    if (!hexagon)
      await authorize()
    else
      sendTransaction?.()
  }

  useEffect(() => {
    if (hexagon && isConfigFetched && !locked.current) {
      sendTransaction?.()
      locked.current = true
    }
  }, [hexagon, isConfigFetched, locked])

  return (
    <>
      <LoadingButton className={props.className} disabled={!props.token} loading={isButtonLoading} variant="contained" onClick={mint}>
        {t('Mint Directly')}
      </LoadingButton>
      {holderLocationMl}
      {holderWaitingMl}
    </>
  )
}
