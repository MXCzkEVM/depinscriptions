import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material'
import { useInjectHolder, useOverlay } from '@overlays/react'
import type { DetailedHTMLProps, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { HelpCircleOutline } from '@ricons/ionicons5'
import { useAsync } from 'react-use'
import BigNumber from 'bignumber.js'
import CountryFlag from './CountryFlag'
import Icon from './Icon'
import DeployIsoHelpDialog from './DeployIsoHelpDialog'
import { useEventBus, useNumberState, useSendSatsTransaction } from '@/hooks'
import { countries as _countries } from '@/config'
import { getTokenDeployed, getTokenSomeId } from '@/api'

function multipliedBy(total: string, n: string | number) {
  return new BigNumber(total).multipliedBy(n).toFixed(0).split('.')[0]
}

function DeployDialog() {
  const { visible, resolve, reject } = useOverlay({
    duration: 500,
  })
  const [country, setCountry] = useState('')
  const [total, setTotal] = useNumberState('21000000', { min: 0, max: '9223372036854775807' })
  const [limit, setLimit] = useNumberState('1000', {
    max: multipliedBy(total, 0.01),
    min: 0,
  })
  const { t } = useTranslation()
  const [holder, openDeployIsoHelp] = useInjectHolder(DeployIsoHelpDialog)

  const [errors, setErrors] = useState({
    tick: '',
    total: '',
    limit: '',
  })
  const { value: deployed = [] } = useAsync(async () => {
    return await getTokenDeployed().then(r => r.data)
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

  function renderTickLabel() {
    return (
      <div className="flex items-center pt-2 gap-2">
        <span>{t('Tick')}</span>
        <Icon className="cursor-pointer" onClick={openDeployIsoHelp} size={18}>
          <HelpCircleOutline />
        </Icon>
      </div>
    )
  }

  const countries = _countries.filter(item => !deployed.includes(item.code))

  useEventBus('dialog:cancel').on(onClose)

  return (
    <>
      <Dialog
        className="token_page_step_2_target"
        aria-describedby="deploy-dialog-slide"
        open={visible}
        keepMounted
        onClose={onClose}
      >
        <DialogTitle>{t('MSC-20 Deploy')}</DialogTitle>
        <DialogContent className="max-w-[550px] md:min-w-[550px]">
          <DialogContentText id="deploy-dialog-slide">
            <Field className="mb-4" label={t('Protocol')}>
              MSC-20
            </Field>
            <Field className="token_page_step_3 mb-3" label={renderTickLabel()}>
              <FormControl error={!!errors.tick} variant="standard" className="w-full -mt-4">
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
            <div className="token_page_step_4 flex flex-col gap-3">
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
                  inputProps={{ min: '0', max: '9223372036854775807' }}
                  type="number"
                  className="w-full"
                />
              </Field>
            </div>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" variant="contained" onClick={onClose}>{t('Cancel')}</Button>
          <LoadingButton className="token_page_step_5" loading={isLoading} variant="contained" onClick={onResolve}>{t('Deploy')}</LoadingButton>
        </DialogActions>
      </Dialog>
      {holder}
    </>
  )
}

function Field(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { label: ReactNode }) {
  return (
    <div {...props} className={`flex items-center ${props.className}`}>
      <div className="w-[120px] text-white">{props.label}</div>
      <div className="ml-2 flex-1">{props.children}</div>
    </div>
  )
}

export default DeployDialog
