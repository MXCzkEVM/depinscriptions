import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, OutlinedInput, Skeleton, Tooltip } from '@mui/material'
import { useOverlay } from '@overlays/react'
import { useTranslation } from 'react-i18next'
import { useAsync, useAsyncFn } from 'react-use'
import { useSnapshot } from 'valtio'
import { DetailedHTMLProps, HTMLAttributes, ReactNode, useCallback } from 'react'
import { LoadingButton } from '@mui/lab'
import { useAccount, useChainId, useSendTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import { HelpCircleOutline } from '@ricons/ionicons5'
import { Flag, Price } from '../surfaces'
import { Condition, Icon } from '../utils'
import { useAsyncCallback, useBalance, useDebounce, useNumberState, useWatch, useWhenever } from '@/hooks'
import { getOrderBelow } from '@/api'
import { BigNum, formatEther, getMarketContractWithSinger, getProviderBySinger } from '@/utils'
import store from '@/store'

export interface LimitOrderDialogProps {
  token: string
}

export function LimitOrderDialog(props: LimitOrderDialogProps) {
  const chainId = useChainId()

  const { visible, resolve, reject } = useOverlay({ duration: 500 })
  const { address } = useAccount()
  const { t } = useTranslation()
  const config = useSnapshot(store.config)

  const [price, setPrice] = useNumberState('')
  const [state, fetch] = useAsyncFn(_fetch, [price, props.token])

  const { value: balance = '0' } = useBalance()

  const debouncePrice = useDebounce(price, 500)

  const { sendTransactionAsync } = useSendTransaction({
    mode: 'recklesslyUnprepared',
  })

  const { value: { data: orders = [] } = {}, loading: isLoadOrd } = state

  const totalAmount = orders.reduce((n, o) => n.plus(o.amount), BigNum(0))
  const paysPrice = orders.reduce((n, o) => n + BigInt(o.price), BigInt(0))

  const [isLoadTrx, purchases] = useAsyncCallback(async () => {
    if (BigNum(balance).lt(paysPrice.toString())) {
      toast.error(t('Insufficient Balance'), { position: 'top-center' })
      return
    }
    const contract = getMarketContractWithSinger(chainId, address!)
    const singer = getProviderBySinger(chainId, address!)
    const data = orders.map((o) => {
      const sign = JSON.parse(o.json)
      return {
        id: o.hash,
        tick: o.tick,
        maker: o.maker,
        amount: o.amount,
        price: o.price,
        s: sign.s,
        r: sign.r,
        v: sign.v,
      }
    })

    const preTransaction = await contract.populateTransaction.purchases(data)
    const transaction = await singer.populateTransaction({
      ...preTransaction,
      value: paysPrice,
      type: 2,
      chainId,
    })
    const { hash } = await sendTransactionAsync({
      recklesslySetUnpreparedRequest: transaction,
    })
    resolve({ hash })
  })

  useWatch([debouncePrice], fetch)

  function _fetch() {
    return getOrderBelow({ price, tick: props.token })
  }

  return (
    <Dialog open={visible} onClose={() => reject()}>
      <DialogTitle id="limit-order-dialog-title" className="flex items-center gap-2">
        <div>
          <span className="mr-2">{t('Limit Order')}</span>
          <span>{props.token}</span>
        </div>
        <Tooltip title={t('Limit Order Help')}>
          <Icon tag="button" className="cursor-pointer" size={18}>
            <HelpCircleOutline />
          </Icon>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="limit-order-dialog-description" className="max-w-[480px] md:min-w-[480px]">
          <div className="mt-10 mb-14">
            <div className="flex flex-col gap-3 max-w-80 mr-8 md:mx-auto">
              <OutlinedInput
                onChange={event => setPrice(event.target.value)}
                placeholder={t('Price')}
                size="small"
                endAdornment="MXC"
                value={price}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Field label={t('Price lower than')}>
              <Price symbol="mxc" value={BigNum(price)} />
              <span className="mx-2 -mt-[2px]">|</span>
              <Price symbol="usd" value={BigNum(price).multipliedBy(config.price).toFixed(2)} />
              <span className="ml-2">
                (
                {t('Per Mint')}
                )
              </span>
            </Field>
            <Field label={t('Total')}>
              <Condition is={!isLoadOrd} else={<Skeleton className="w-60" />}>
                <Price image={<Flag className="mr-2" find={props.token} text={false} />} value={totalAmount} />
                <span className="mx-2 -mt-[2px]">|</span>
                <span>{t('orders', { total: orders.length })}</span>
              </Condition>
            </Field>
            <Field label={t('Price')}>
              <Price symbol="mxc" value={formatEther(paysPrice)} />
            </Field>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="contained" onClick={() => reject()}>
          {t('Cancel')}
        </Button>
        <LoadingButton
          disabled={!orders.length}
          loading={isLoadOrd || isLoadTrx}
          variant="contained"
          onClick={purchases}
          autoFocus
        >
          {t('Confirm')}
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
