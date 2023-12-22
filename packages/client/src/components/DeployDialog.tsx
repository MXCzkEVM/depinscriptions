import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material'
import { useOverlay } from '@overlays/react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { } from '@rainbow-me/rainbowkit'
import { useSendSatsTransaction } from '@/hooks'

function DeployDialog() {
  const { visible, resolve, reject } = useOverlay({
    duration: 500,
  })
  const [country, setCountry] = useState('')
  const [total, setTotal] = useState('')
  const [limit, setLimit] = useState('')

  const [errors, setErrors] = useState({
    tick: '',
    total: '',
    limit: '',
  })

  const { sendTransaction, isLoading } = useSendSatsTransaction({
    data: {
      p: 'msc-20',
      op: 'mint',
      tick: country,
      max: total,
      lim: limit,
    },
    onSuccess(data) {
      resolve({
        tick: country,
        deployHash: data.hash,
        json: data.json,
        total,
        limit,
      })
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
    sendTransaction?.()
  }

  function onClose() {
    if (isLoading)
      return
    reject()
  }

  return (
    <Dialog
      open={visible}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"

    >
      <DialogTitle>MSC-20 Deploy</DialogTitle>
      <DialogContent className="w-[550px]">
        <DialogContentText className="flex flex-col gap-3" id="alert-dialog-slide-description">
          <Field label="Protocol">
            MSC-20
          </Field>
          <Field label="Tick">
            <FormControl error={!!errors.tick} variant="standard" className="w-full">
              <InputLabel id="country">Country and Region</InputLabel>
              <Select
                labelId="country"
                id="country"
                placeholder="Country and Region"
                onChange={event => setCountry(event.target.value)}
                value={country}
              >
                <MenuItem value="">
                  None
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Field>
          <Field label="Total Supply">
            <Input
              error={!!errors.total}
              onChange={event => setTotal(event.target.value)}
              value={total}
              inputProps={{ min: '0' }}
              type="number"
              className="w-full"
            />
          </Field>
          <Field label="Limit Per Mint">
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
        <Button color="inherit" variant="contained" onClick={onClose}>Cancel</Button>
        <LoadingButton loading={isLoading} variant="contained" onClick={onResolve}>Deploy</LoadingButton>
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
