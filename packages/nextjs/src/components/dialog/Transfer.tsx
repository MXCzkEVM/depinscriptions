import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input } from '@mui/material'
import { useOverlay } from '@overlays/react'
import type { DetailedHTMLProps, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import BigNumber from 'bignumber.js'
import { utils } from 'ethers'
import { Flag } from '../surfaces'
import { useSendSatsTransaction } from '@/hooks'
import { thousandBitSeparator } from '@/utils'
import { HolderDto } from '@/api/index.type'

export interface TransferDialogProps {
  holder: HolderDto
}

export interface TransferDialogResolved {
  hash: string
  json: string
}
export function TransferDialog(props: TransferDialogProps) {
  const { visible, resolve, reject } = useOverlay({
    duration: 500,
  })
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const { t } = useTranslation()

  const [errors, setErrors] = useState({
    amount: '',
    to: '',
  })

  const { sendTransaction, isLoading } = useSendSatsTransaction({
    onSuccess: data => resolve(data),
    to,
    data: {
      p: 'msc-20',
      op: 'transfer',
      tick: props.holder.tick,
      amt: amount,
    },
  })

  async function onResolve() {
    const helpers = { to: '', amount: '' }
    if (!to)
      helpers.to = t('Please enter the address')
    if (to && !utils.isAddress(to))
      helpers.to = t('Please enter the correct address')
    if (!amount || amount === '0')
      helpers.amount = t('Please enter the amount')
    if (new BigNumber(amount).gt(props.holder.value))
      helpers.amount = t('Exceeding available amount')

    setErrors(helpers)
    const errorMessage = helpers.to || helpers.amount
    if (errorMessage) {
      toast.error(errorMessage, { position: 'top-center' })
      return
    }

    sendTransaction?.()
  }

  function onClose() {
    reject()
  }
  return (
    <Dialog
      aria-describedby="alert-dialog-slide-description"
      open={visible}
      keepMounted
      onClose={onClose}
    >
      <DialogTitle>{t('MSC-20 Transfer')}</DialogTitle>
      <DialogContent className="max-w-[550px] md:min-w-[550px]">
        <DialogContentText className="flex flex-col gap-3" id="alert-dialog-slide-description">
          <Field label={t('Tick')}>
            <Flag find={props.holder.tick} />
          </Field>
          <Field label={t('To')}>
            <Input
              placeholder="0x...5e0d7A"
              error={!!errors.to}
              onChange={event => setTo(event.target.value)}
              value={to}
              className="w-full"
            />
          </Field>
          <Field label={t('Amount')}>
            <Input
              error={!!errors.amount}
              onChange={event => setAmount(event.target.value)}
              value={amount}
              inputProps={{ min: '0', max: props.holder.value }}
              placeholder={thousandBitSeparator(props.holder.value)}
              type="number"
              className="w-full"
            />
          </Field>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="contained" onClick={onClose}>{t('Cancel')}</Button>
        <LoadingButton loading={isLoading} variant="contained" onClick={onResolve}>{t('Transfer')}</LoadingButton>
      </DialogActions>
    </Dialog>

  )
}

function Field(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { label: ReactNode }) {
  return (
    <div {...props} className={`flex items-center ${props.className}`}>
      <div className="w-[75px] text-white">{props.label}</div>
      <div className="flex-1">{props.children}</div>
    </div>
  )
}
