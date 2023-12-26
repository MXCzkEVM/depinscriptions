import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material'
import { useOverlay } from '@overlays/react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import CountryFlag from './CountryFlag'
import { useSendSatsTransaction } from '@/hooks'
import { countries } from '@/config'
import { getTokenSomeId } from '@/api'

function DeployDialog() {
  const { visible, resolve, reject } = useOverlay({
    duration: 500,
  })
  const [country, setCountry] = useState('')
  const [total, setTotal] = useState('21000000')
  const [limit, setLimit] = useState('1000')
  const { t } = useTranslation()

  const [errors, setErrors] = useState({
    tick: '',
    total: '',
    limit: '',
  })

  const { sendTransaction, isLoading } = useSendSatsTransaction({
    onSuccess: data => resolve(data),
    data: {
      p: 'msc-20',
      op: 'deploy',
      tick: country,
      max: total,
      lim: limit,
    },
  })

  async function onResolve() {
    const helpers = { tick: '', total: '', limit: '' }
    if (!country)
      helpers.tick = 'Please select country and region'
    if (!total || +total <= 0)
      helpers.total = 'Please enter a positive integer'
    if (!limit || +limit <= 0)
      helpers.limit = 'Please enter a positive integer'
    setErrors(helpers)
    if (helpers.limit || helpers.tick || helpers.total)
      return
    const { data: isSomeToken } = await getTokenSomeId({ id: country })
    if (isSomeToken) {
      toast.error(t(`has been deployed`, { tick: country }), { position: 'top-center' })
      return
    }

    sendTransaction?.()
  }

  function onClose() {
    if (isLoading)
      return
    reject()
  }

  return (
    <Dialog
      aria-describedby="alert-dialog-slide-description"
      open={visible}
      keepMounted
      onClose={onClose}
    >
      <DialogTitle>{t('MSC-20 Deploy')}</DialogTitle>
      <DialogContent className="max-w-[550px] md:min-w-[550px]">
        <DialogContentText className="flex flex-col gap-3" id="alert-dialog-slide-description">
          <Field label={t('Protocol')}>
            MSC-20
          </Field>
          <Field label={t('Tick')}>
            <FormControl error={!!errors.tick} variant="standard" className="w-full">
              <InputLabel id="country">{t('Country and Region')}</InputLabel>
              <Select
                labelId="country"
                id="country"
                placeholder="Country and Region"
                onChange={event => setCountry(event.target.value)}
                value={country}
              >
                {countries.map(country => (
                  <MenuItem key={country.code} value={country.code}>
                    <CountryFlag code={country.code} image={country.image} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Field>
          <Field label={t('Total Supply')}>
            <Input
              error={!!errors.total}
              onChange={event => setTotal(event.target.value)}
              value={total}
              inputProps={{ min: '0' }}
              type="number"
              className="w-full"
            />
          </Field>
          <Field label={t('Limit Per Mint')}>
            <Input
              error={!!errors.limit}
              onChange={event => setLimit(event.target.value)}
              value={limit}
              inputProps={{ min: '0' }}
              type="number"
              className="w-full"
            />
          </Field>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="contained" onClick={onClose}>{t('Cancel')}</Button>
        <LoadingButton loading={isLoading} variant="contained" onClick={onResolve}>{t('Deploy')}</LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

function Field(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { label: string }) {
  return (
    <div {...props} className={`flex items-center ${props.className}`}>
      <div className="w-[160px] text-white">{props.label}</div>
      <div className="flex-1">{props.children}</div>
    </div>
  )
}

export default DeployDialog
