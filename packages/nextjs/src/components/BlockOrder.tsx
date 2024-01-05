import { Button, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSnapshot } from 'valtio'
import { useContext, useState } from 'react'
import { useAccount, useChainId, useSendTransaction } from 'wagmi'
import { Contract, providers, utils } from 'ethers'
import { useInjectHolder } from '@overlays/react'
import { LoadingButton } from '@mui/lab'
import Block from './Block'
import Flag from './Flag'
import Price from './Price'
import WaitingIndexModal from './WaitingIndexModal'
import { BigNum, cover, thousandBitSeparator } from '@/utils'
import store from '@/store'
import { OrderDto } from '@/api/index.type'
import MarketContext from '@/ui/market/Context'
import { chains } from '@/config'
import { MarketContract, marketFragment } from '@/config/abis'
import { useEventBus } from '@/hooks'

export interface BlockOrderProps {
  data: OrderDto
}

function BlockOrder(props: BlockOrderProps) {
  const { t } = useTranslation()
  const config = useSnapshot(store.config)
  const chainId = useChainId()
  const { limit, mode } = useContext(MarketContext)
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const [holderWaitingMl, openWaitingIndexModal] = useInjectHolder(WaitingIndexModal)
  const { emit: reloadPage } = useEventBus('reload:page')

  const unitPrice = BigNum(props.data.price).div(props.data.amount)
  const limitPrice = BigNum(limit).multipliedBy(unitPrice)

  const mxc = mode === 'unit' ? unitPrice : limitPrice
  const usd = BigNum(mxc).multipliedBy(config.price).toFixed(4)

  const { sendTransactionAsync } = useSendTransaction({
    mode: 'recklesslyUnprepared',
  })

  async function onPurchase() {
    setLoading(true)
    const value = BigNum(props.data.price).multipliedBy(10 ** 18).toFixed(0)
    const contract = getMarketContractWithSinger(chainId, address!)
    const singer = getSinger(chainId, address!)
    try {
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
        ...preTransaction,
        type: 2,
        chainId,
        value,
      })
      const { hash } = await sendTransactionAsync({ recklesslySetUnpreparedRequest: transaction })
      await openWaitingIndexModal({ hash })
      reloadPage()
      setLoading(true)
    }
    catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  function renderFooter() {
    const usd = BigNum(props.data.price).multipliedBy(config.price).toFixed(4)
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
          <Price symbol="mxc" value={props.data.price} />
          <Price symbol="usd" value={usd} />
        </div>
        <LoadingButton loading={loading} variant="outlined" className="w-full" onClick={onPurchase}>{t('Buy')}</LoadingButton>
      </>
    )
  }
  return (
    <Block footer={renderFooter()}>
      {holderWaitingMl}
      <div className="flex items-center">
        <span>{props.data.tick}</span>
        <Flag find={props.data.tick} />
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

function getMarketContractWithSinger(chainId: number, address: string) {
  const contract = process.env.NEXT_PUBLIC_MARKET_CONTRACT as `0x${string}`
  const singer = getSinger(chainId, address)
  const market = new Contract(contract, marketFragment, singer)
  return market as Contract & MarketContract
}
function getSinger(chainId: number, address: string) {
  const rpc = chains[chainId].rpcUrls.default.http[0]
  const name = chains[chainId].name
  const jsonProvider = new providers.JsonRpcProvider(rpc, { chainId, name })
  return jsonProvider.getSigner(address)
}
export default BlockOrder
