import { Button, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSnapshot } from 'valtio'
import { useContext, useState } from 'react'
import { useAccount, useChainId, useSendTransaction } from 'wagmi'
import { utils } from 'ethers'
import { useInjectHolder } from '@overlays/react'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-hot-toast'
import { delay } from '@hairy/utils'
import { WaitIndexDialog } from '../dialog'
import { Condition } from '../utils'
import { LocationForHexagon } from '../data-display'
import CardDefault from './CardDefault'
import { Flag } from './Flag'
import { Price } from './Price'
import { BigNum, cover, getMarketContractWithSinger, getProviderBySinger, thousandBitSeparator } from '@/utils'
import store from '@/store'
import { Order } from '@/api/index.type'
import MarketContext from '@/ui/market/Context'
import { useAsyncCallback, useBalance, useEventBus } from '@/hooks'

export interface CardOrderProps {
  data: Order
}

export function CardOrder(props: CardOrderProps) {
  const config = useSnapshot(store.config)
  const chainId = useChainId()
  const { t } = useTranslation()
  const { limit, mode } = useContext(MarketContext)
  const { address } = useAccount()
  const { value: balance = '0' } = useBalance()

  const [holderWaitingMl, openWaitIndexDialog] = useInjectHolder(WaitIndexDialog)
  const { emit: reloadPage } = useEventBus('reload:page')

  const unitPrice = BigNum(utils.formatEther(props.data.price)).div(props.data.amount)
  const limitPrice = BigNum(limit).multipliedBy(unitPrice)

  const mxc = mode === 'unit' ? unitPrice : limitPrice
  const usd = BigNum(mxc).multipliedBy(config.price).toFixed(4)
  const signature = JSON.parse(props.data.json)
  const { sendTransactionAsync } = useSendTransaction({
    mode: 'recklesslyUnprepared',
  })

  const [loading, purchase] = useAsyncCallback(async () => {
    if (BigNum(balance).lt(props.data.price)) {
      toast.error(t('Insufficient Balance'), { position: 'top-center' })
      return
    }
    const contract = getMarketContractWithSinger(chainId, address!)
    const singer = getProviderBySinger(chainId, address!)
    const preTransaction = await contract.populateTransaction.purchase(
      props.data.hash,
      props.data.tick,
      props.data.maker,
      props.data.amount,
      props.data.price,
      signature.r,
      signature.s,
      signature.v,
    )
    const transaction = await singer.populateTransaction({
      value: props.data.price,
      ...preTransaction,
      type: 2,
      chainId,
    })
    const { hash } = await sendTransactionAsync({
      recklesslySetUnpreparedRequest: transaction,
    })
    await openWaitIndexDialog({ hash })
    toast.success(t('Purchase successful'), { position: 'top-center' })
    await delay(500)
    reloadPage()
  })

  function renderFooter() {
    const price = utils.formatEther(props.data.price)
    const usd = BigNum(price).multipliedBy(config.price).toFixed(4)
    return (
      <>
        <div className="flex justify-between text-sm">
          <span>
            #
            {props.data.number}
          </span>
          <span>{cover(props.data.maker, [4, 3, 4])}</span>
        </div>
        <Divider className="my-2 sm:my-4" />
        <div className="flex justify-between text-sm mb-4">
          <Price symbol="mxc" value={price} decimal={2} />
          <Price symbol="usd" value={usd} decimal={2} />
        </div>
        <LoadingButton loading={loading} variant="outlined" className="w-full" onClick={purchase}>{t('Buy')}</LoadingButton>
      </>
    )
  }
  return (
    <CardDefault footer={renderFooter()}>
      {holderWaitingMl}
      <div className="flex justify-between items-center gap-5">
        <div className="flex items-center flex-shrink-0">
          <span className="mr-2">{props.data.tick}</span>
          <Flag text={false} find={props.data.tick} />
        </div>
        <Condition is={signature.hex}>
          <div className="max-w-50% text-xs overflow-hidden">
            <LocationForHexagon hexagon={signature.hex} />
          </div>
        </Condition>
      </div>
      <div className="my-2 sm:mt-3 sm:mb-4 flex justify-center items-center text-lg font-bold">
        {thousandBitSeparator(props.data.amount)}
      </div>
      <div className="text-[#2196F3] gap-2 flex justify-center mb-3">
        <Price symbol="mxc" value={mxc} decimal={mode !== 'unit' ? 2 : undefined} />
        <span> / </span>
        <span>{mode === 'mint' ? t('Per Mint') : props.data.tick}</span>
      </div>
      <div className="flex justify-center text-sm text-[#e5e7eb]">
        <Price symbol="usd" value={usd} decimal={mode !== 'unit' ? 2 : undefined} />
      </div>
    </CardDefault>
  )
}
