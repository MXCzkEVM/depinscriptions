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
import Block from './CardDefault'
import { Flag } from './Flag'
import { Price } from './Price'
import { BigNum, cover, getMarketContractWithSinger, getProviderBySinger, thousandBitSeparator } from '@/utils'
import store from '@/store'
import { Order } from '@/api/index.type'
import MarketContext from '@/ui/market/Context'
import { useAsyncCallback, useEventBus } from '@/hooks'

export interface CardOrderProps {
  data: Order
}

export function CardOrder(props: CardOrderProps) {
  const config = useSnapshot(store.config)
  const chainId = useChainId()
  const { t } = useTranslation()
  const { limit, mode } = useContext(MarketContext)
  const { address } = useAccount()
  const [holderWaitingMl, openWaitIndexDialog] = useInjectHolder(WaitIndexDialog)
  const { emit: reloadPage } = useEventBus('reload:page')

  const unitPrice = BigNum(utils.formatEther(props.data.price)).div(props.data.amount)
  const limitPrice = BigNum(limit).multipliedBy(unitPrice)

  const mxc = mode === 'unit' ? unitPrice : limitPrice
  const usd = BigNum(mxc).multipliedBy(config.price).toFixed(4)

  const { sendTransactionAsync } = useSendTransaction({
    mode: 'recklesslyUnprepared',
  })

  const [loading, purchase] = useAsyncCallback(async () => {
    const contract = getMarketContractWithSinger(chainId, address!)
    const singer = getProviderBySinger(chainId, address!)
    const { r, s, v } = JSON.parse(props.data.json)
    const preTransaction = await contract.populateTransaction.purchase(
      props.data.hash,
      props.data.tick,
      props.data.maker,
      props.data.amount,
      props.data.price,
      r,
      s,
      v,
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
        <Divider className="my-4" />
        <div className="flex justify-between text-sm mb-4">
          <Price symbol="mxc" value={price} />
          <Price symbol="usd" value={usd} />
        </div>
        <LoadingButton loading={loading} variant="outlined" className="w-full" onClick={purchase}>{t('Buy')}</LoadingButton>
      </>
    )
  }
  return (
    <Block footer={renderFooter()}>
      {holderWaitingMl}
      <div className="flex items-center">
        <span>{props.data.tick}</span>
        <Flag text={false} find={props.data.tick} />
      </div>
      <div className="mt-3 mb-4 flex justify-center items-center text-lg font-bold">
        {thousandBitSeparator(props.data.amount)}
      </div>
      <div className="text-[#6300ff] gap-2 flex justify-center mb-3">
        <Price symbol="mxc" value={mxc} />
        <span> / </span>
        <span>{mode === 'mint' ? t('Per Mint') : props.data.tick}</span>
      </div>
      <div className="flex justify-center text-sm text-[#e5e7eb]">
        <Price symbol="usd" value={usd} />
      </div>
    </Block>
  )
}
