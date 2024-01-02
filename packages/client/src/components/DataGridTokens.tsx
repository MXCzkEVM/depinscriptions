import { useMount } from 'react-use'
import { LoadingButton } from '@mui/lab'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import Condition from './Condition'
import Empty from './Empty'
import BlockToken from './BlockToken'
import InfiniteScroll from './InfiniteScroll'
import Blocks from './Blocks'
import { getHolder } from '@/api'
import { useEventBus, useServerPaginationConcat } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

export interface DataGridTokensProps {
  address?: string
}

function DataGridTokens(props: DataGridTokensProps) {
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
          <Blocks>
            <BlockToken guide data={example} />
          </Blocks>
          )
        : <Empty loading={state.loading} />}
    >
      <InfiniteScroll
        loaded={state.loaded}
        loader={(
          <div className="flex justify-center py-2">
            <LoadingButton />
          </div>
        )}
        next={next}
      >
        <Blocks>
          {state.value.map((item, index) => <BlockToken guide={index === 0} key={item.id} data={item} />)}
        </Blocks>
      </InfiniteScroll>

    </Condition>
  )
}

export default DataGridTokens
