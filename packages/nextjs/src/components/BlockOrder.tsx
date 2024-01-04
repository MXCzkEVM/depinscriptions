import { Button, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { useSnapshot } from 'valtio'
import { utils } from 'ethers'
import { useContext } from 'react'
import Block from './Block'
import Flag from './Flag'
import Price from './Price'
import { BigNum, cover, thousandBitSeparator } from '@/utils'
import store from '@/store'
import { MarketDetailDto, OrderDto } from '@/api/index.type'
import MarketContext from '@/ui/market/Context'

export interface BlockOrderProps {
  data: OrderDto
}

function BlockOrder(props: BlockOrderProps) {
  const { t } = useTranslation()
  const config = useSnapshot(store.config)
  const { limit, mode } = useContext(MarketContext)

  const unitPrice = BigNum(props.data.price).div(props.data.amount)
  const limitPrice = BigNum(limit).multipliedBy(unitPrice)

  const mxc = mode === 'unit' ? unitPrice : limitPrice
  const usd = BigNum(mxc).multipliedBy(config.price).toFixed(4)

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
        <Button variant="outlined" className="w-full">{t('Buy')}</Button>
      </>
    )
  }
  return (
    <Block footer={renderFooter()}>
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

export default BlockOrder
