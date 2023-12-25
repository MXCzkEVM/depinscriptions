import { useEffect, useState } from 'react'
import { useInjectHolder } from '@overlays/react'
import { latLngToCell } from 'h3-js'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import LocationModal from './LocationModal'
import { TickDto } from '@/api/index.type'
import { useSendSatsTransaction } from '@/hooks'
import { getCurrentPosition } from '@/utils'

export interface MintButtonProps {
  token?: TickDto
}

function MintButton(props: MintButtonProps) {
  const [hexagon, setHexagon] = useState('')
  const [locked, setLocked] = useState(false)
  const { t } = useTranslation()

  const { isLoading: isButtonLoading, sendTransaction, isConfigFetched } = useSendSatsTransaction({
    data: {
      p: 'msc-20',
      op: 'mint',
      tick: props.token?.tick,
      amt: props.token?.limit || 0,
      hex: hexagon,
    },
  })

  const [holderModal, openLocationModal] = useInjectHolder(LocationModal)
  async function authorize() {
    await openLocationModal()
    const position = await getCurrentPosition()
    const hexagon = latLngToCell(
      position.coords.latitude,
      position.coords.longitude,
      7,
    )
    setHexagon(hexagon)
  }

  async function mint() {
    if (!hexagon)
      await authorize()
    else
      sendTransaction?.()
  }

  useEffect(() => {
    if (hexagon && isConfigFetched && !locked) {
      sendTransaction?.()
      setLocked(true)
    }
  }, [hexagon, isConfigFetched, locked])

  return (
    <LoadingButton disabled={!props.token} loading={isButtonLoading} variant="contained" onClick={mint}>
      {t('Mint Directly')}
      {holderModal}
    </LoadingButton>
  )
}

export default MintButton
