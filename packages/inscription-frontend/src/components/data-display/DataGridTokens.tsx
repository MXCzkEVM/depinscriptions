import { useMount } from 'react-use'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { Condition, Empty, InfiniteScroll } from '../utils'

import { CardContainer, CardToken } from '../surfaces'

import { getHolder } from '@/api'
import { useEventBus, useServerPaginationConcat, useWhenever } from '@/hooks'

export interface DataGridTokensProps {
  address?: string
}

export function DataGridTokens(props: DataGridTokensProps) {
  const [state, { reload, next }] = useServerPaginationConcat({
    resolve: model => getHolder({ ...model, owner: props.address || '' }),
  })
  const { address } = useAccount()
  const [showExample, setShowExample] = useState(false)

  const example = {
    id: 1,
    number: 2,
    owner: address!,
    tick: 'DEU',
    value: 10000,
  }

  useEventBus<boolean>('setter:setShowPersonalExample').on(setShowExample)
  useEventBus<unknown>('reload:page').on(reload)

  useWhenever(props.address, reload)
  useMount(reload)

  return (
    <Condition
      is={state.value.length}
      else={showExample
        ? (
          <CardContainer>
            <CardToken guide data={example} />
          </CardContainer>
          )
        : <Empty loading={state.loading} />}
    >
      <InfiniteScroll
        loaded={state.loaded}
        next={next}
      >
        <CardContainer>
          {state.value.map((item, index) => <CardToken guide={index === 0} key={item.id} data={item} />)}
        </CardContainer>
      </InfiniteScroll>

    </Condition>
  )
}
