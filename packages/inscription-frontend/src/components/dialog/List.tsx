import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input, Link, MenuItem, OutlinedInput, Select } from '@mui/material'
import { useOverlay } from '@overlays/react'
import { DetailedHTMLProps, HTMLAttributes, ReactNode, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { useSnapshot } from 'valtio'
import { useAsync } from 'react-use'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'
import { Flag, Price } from '../surfaces'
import { ListFill } from './ListFill'
import { MarketDetail } from '@/api/index.type'
import store from '@/store'
import { BigNum, formatEther } from '@/utils'
import { useNumberState, useSendSatsTransaction } from '@/hooks'
import { getHolder } from '@/api'

const monthTimestamp = 24 * 3600 * 1000 * 30
const yearTimestamp = 24 * 3600 * 1000 * 365

export interface ListDialogProps {
  data: MarketDetail
}
export interface ListDialogResolved {
  hash: string
  json: string
}

export function ListDialog(props: ListDialogProps) {
  const { t } = useTranslation()
  const { visible, resolve, reject } = useOverlay({
    duration: 500,
  })
  const { address } = useAccount()
  const config = useSnapshot(store.config)

  const [mxcMint, setMxcMint] = useNumberState('')
  const [amount, setAmount] = useNumberState('')
  const [expiration, setExpiration] = useState('month')

  const { value: balance = '0' } = useAsync(getBalance, [props.data, address])

  function onFillLimit(n: string) {
    if (!n || n === '0')
      return
    const a = BigInt(props.data.limit || 0) * BigInt(n)
    setAmount(a.toString())
  }

  const usdMint = BigNum(config.price).multipliedBy(mxcMint || 0)
  const mxcRevenue = BigNum(mxcMint || 0).div(props.data.limit).multipliedBy(amount || 0)
  const usdRevenue = mxcRevenue.multipliedBy(config.price)
  const limitPrice = formatEther(props.data.limitPrice).toString()

  const { sendTransaction, isLoading } = useSendSatsTransaction({
    onSuccess: data => resolve(data),
    to: process.env.NEXT_PUBLIC_MARKET_CONTRACT!,
    data: {
      p: 'msc-20',
      op: 'list',
      tick: props.data.tick,
      pre: mxcRevenue.multipliedBy(10 ** 18).toFixed(0),
      amt: amount,
      exp: expiration === 'month'
        ? monthTimestamp
        : yearTimestamp,
    },
  })

  async function getBalance() {
    const { data: [holder] } = await getHolder({
      owner: address,
      tick: props.data.tick,
      page: 1,
      limit: 1,
    })
    return String(holder?.value || '0')
  }

  async function onResolve() {
    if (!mxcMint || mxcMint === '0') {
      toast.error(t('Please enter the price'), { position: 'top-center' })
      return
    }
    if (usdRevenue.lt(10)) {
      toast.error(t('Order total amount should be greater than 10'), { position: 'top-center' })
      return
    }
    if (new BigNumber(balance).lt(amount || 0)) {
      toast.error(t('You dont have enough tick', { token: props.data.tick }), { position: 'top-center' })
      return
    }

    sendTransaction?.()
  }

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
          <Flag find={props.data.tick} />
          for sale
        </Trans>
      </DialogTitle>
      <DialogContent className="max-w-[550px] md:min-w-[550px]">
        <DialogContentText id="deploy-dialog-slide">
          <div className="mt-10 mb-14">
            <div className="flex flex-col gap-3 max-w-80 mr-8 md:mx-auto">
              <OutlinedInput
                placeholder={t('Price')}
                size="small"
                endAdornment="MXC"
                value={mxcMint}
                onChange={event => setMxcMint(event.target.value)}
              />
              <div className="relative">
                <OutlinedInput
                  className="w-full"
                  placeholder={t('Amount')}
                  size="small"
                  value={amount}
                  onChange={event => setAmount(event.target.value)}
                  endAdornment={<span className="text-nowrap cursor-pointer" onClick={() => setAmount(balance)}>{t('All')}</span>}
                />
                <ListFill onFill={onFillLimit} />
              </div>
            </div>
            <div className="mt-5 text-center mb-5">
              {t('Floor price')}
              {' '}
              <Link className="cursor-pointer" onClick={() => setMxcMint(limitPrice)}>
                {limitPrice}
                {' '}
                MXC
              </Link>
              ,
              {' '}
              {t('Your price')}
              {' '}
              <Price symbol="usd" value={usdMint} />
              <span className="text-white text-opacity-80">(Per Mint)</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Field label="Expiration">
              <Select
                value={expiration}
                size="small"
                className="w-[100px]"
                variant="standard"
                onChange={event => setExpiration(event.target.value as string)}
              >
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </Field>
            <Field label="Service Fee">2%</Field>
            <Field label="Total Revenue">
              <div className="flex gap-2 items-center">
                <Price symbol="mxc" value={mxcRevenue.toFixed()} />
                <span>|</span>
                <Price symbol="usd" value={usdRevenue.toFixed()} />
              </div>
            </Field>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="contained" onClick={() => reject()}>{t('Cancel')}</Button>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          onClick={onResolve}
        >
          {t('List')}
        </LoadingButton>
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
