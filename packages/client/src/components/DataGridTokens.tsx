import { useMount } from 'react-use'
import { LoadingButton } from '@mui/lab'
import Condition from './Condition'
import Empty from './Empty'
import BoxToken from './BoxToken'
import InfiniteScroll from './InfiniteScroll'
import { getHolder } from '@/api'
import { useMittOn } from '@/hooks/useMittOn'
import { useServerPaginationConcat } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

export interface DataGridTokensProps {
  address?: string
}

function DataGridTokens(props: DataGridTokensProps) {
  const [state, { reload, next }] = useServerPaginationConcat({
    resolve: model => getHolder({ ...model, owner: props.address || '' }),
  })

  useMittOn('reload:page', reload)
  useWhenever(props.address, reload)
  useMount(reload)

  return (
    <Condition is={state.value.length} else={<Empty loading={state.loading} />}>
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
          {state.value.map(item => <BoxToken key={item.id} data={item} />)}
        </div>
      </InfiniteScroll>

    </Condition>
  )
}

export default DataGridTokens
