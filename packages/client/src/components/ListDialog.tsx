import { LoadingButton } from '@mui/lab'
import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input, OutlinedInput, TextField, Tooltip } from '@mui/material'
import { useOverlay } from '@overlays/react'
import { DetailedHTMLProps, HTMLAttributes, ReactNode, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Calculator } from '@ricons/ionicons5'
import CountryFlag from './CountryFlag'
import Icon from './Icon'
import ListDialogFill from './ListDialogFill'
import Block from './Block'
import { thousandBitSeparator } from '@/utils'

export interface ListDialogProps {
  tick: string
}

function ListDialog(_props: ListDialogProps) {
  const { t } = useTranslation()
  const { visible, resolve, reject } = useOverlay({
    duration: 500,
  })
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')

  return (
    <Dialog
      className="token_page_step_2_target"
      aria-describedby="deploy-dialog-slide"
      open={visible}
      keepMounted
      onClose={() => reject()}
    >

      <DialogTitle>
        <Trans i18nKey="List Dialog Title">
          List
          <CountryFlag find="CRI"></CountryFlag>
          for sale
        </Trans>
      </DialogTitle>
      <DialogContent className="max-w-[550px] md:min-w-[550px]">
        <DialogContentText id="deploy-dialog-slide">
          <div className="flex flex-col gap-3 max-w-80 mx-auto">
            <OutlinedInput
              placeholder={t('Price')}
              size="small"
              endAdornment="MXC"
            />
            <div className="relative">
              <OutlinedInput
                className="w-full"
                placeholder={t('Amount')}
                size="small"
                endAdornment={<span className="text-nowrap cursor-pointer">{t('All')}</span>}
              />
              <ListDialogFill />
            </div>

          </div>
          <div className="mt-5 text-center mb-5">
            Floor price 0.0448 MXC, Your price $ 1.8614(Per Mint)
          </div>
          <div className="flex flex-col gap-3">
            <Field label="Expiration">

            </Field>
            <Field label="Service Fee">2%</Field>
            <Field label="Total Revenue">0 MXC</Field>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="contained" onClick={() => reject()}>{t('Cancel')}</Button>
        <LoadingButton variant="contained" onClick={() => resolve()}>{t('Deploy')}</LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

function Field(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { label: ReactNode }) {
  return (
    <div {...props} className={`flex items-end ${props.className}`}>
      <div className="w-[120px] -mb-[3px] text-white">{props.label}</div>
      <div className="ml-2 flex-1 flex justify-end">{props.children}</div>
    </div>
  )
}

export default ListDialog
