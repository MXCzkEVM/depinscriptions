import { useMount } from 'react-use'
import { LoadingButton } from '@mui/lab'
import { useAccount } from 'wagmi'
import Condition from './Condition'
import Empty from './Empty'
import BoxToken from './BoxToken'
import InfiniteScroll from './InfiniteScroll'
import { getHolder } from '@/api'
import { useMittOn } from '@/hooks/useMittOn'
import { useGlobalPersonalExample, useServerPaginationConcat } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

export interface DataGridTokensProps {
  address?: string
}

function DataGridTokens(props: DataGridTokensProps) {
  const [state, { reload, next }] = useServerPaginationConcat({
    resolve: model => getHolder({ ...model, owner: props.address || '' }),
  })
  const { address } = useAccount()
  const [showExample] = useGlobalPersonalExample()

  const example = {
    id: 1,
    number: 2,
    owner: address!,
    tick: 'DEU',
    value: 10000,
  }

  useMittOn('reload:page', reload)
  useMittOn('deploy-reload:page', reload)
  useWhenever(props.address, reload)
  useMount(reload)

  return (
    <Condition
      is={state.value.length}
      else={showExample
        ? (
          <div className="grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]">
            <BoxToken guide data={example} />
          </div>
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
        <div className="grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]">
          {state.value.map((item, index) => <BoxToken guide={index === 0} key={item.id} data={item} />)}
        </div>
      </InfiniteScroll>

    </Condition>
  )
}

export default DataGridTokens
