import { LoadingButton } from '@mui/lab'
import { useMount } from 'react-use'
import { useRouter } from 'next/router'
import { getOrderListed } from '@/api'
import { BlockOrder, Blocks, Condition, Empty, InfiniteScroll, Refresh, SearchTextField } from '@/components'
import { useRouterQuery, useServerPaginationConcat } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'
import { MarketDetailDto } from '@/api/index.type'

function Listed() {
  const tick = useRouterQuery('token')

  const [state, { reload, next }] = useServerPaginationConcat({
    resolve: model => getOrderListed({ ...model, tick }),
  })

  useWhenever(tick, reload)
  return (
    <>
      <Condition is={state.value.length} else={<Empty loading={state.loading} />}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 items-center">
            <span className="mt-[2px]">Result: 5585</span>
            <Refresh hideText />
          </div>
          <SearchTextField />
        </div>
        <InfiniteScroll
          loaded={state.loaded}
          next={next}
        >
          <Blocks>
            {state.value.map((data, index) => <BlockOrder key={index} data={data} />)}
          </Blocks>
        </InfiniteScroll>
      </Condition>
    </>
  )
}

export default Listed
