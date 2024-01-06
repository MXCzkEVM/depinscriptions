import { useEffect, useRef, useState } from 'react'
import { useInjectHolder } from '@overlays/react'
import { latLngToCell } from 'h3-js'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import { LocationDialog, WaitIndexDialog } from '../dialog'

import { Token } from '@/api/index.type'
import { useEventBus, useSendSatsTransaction } from '@/hooks'
import { getCurrentPosition } from '@/utils'

export interface MintButtonProps {
  token?: Token
  className?: string
}

export function MintButton(props: MintButtonProps) {
  const [hexagon, setHexagon] = useState('')
  const locked = useRef(false)
  const { t } = useTranslation()

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
    const position = await getCurrentPosition()
    const hexagon = latLngToCell(
      position.coords.latitude,
      position.coords.longitude,
      7,
    )
    setHexagon(hexagon)
  }

  async function mint() {
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
