import { useTranslation } from 'react-i18next'
import { getOrderListed } from '@/api'
import { BlockOrder, Blocks, Condition, Empty, InfiniteScroll, Refresh, SearchTextField } from '@/components'
import { useEventBus, useRouterQuery, useServerPaginationConcat } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

function Listed() {
  const tick = useRouterQuery('token')
  const { t } = useTranslation()
  const [state, { reload, next }] = useServerPaginationConcat({
    resolve: model => getOrderListed({ ...model, tick }),
  })

  useWhenever(tick, reload)
  useEventBus('reload:page').on(reload)
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 items-center">
          <span className="mt-[2px]">
            {t('Result')}
            :
            {' '}
            {state.pagination.total}
          </span>
          <Refresh onClick={reload} hideText />
        </div>
        {/* <SearchTextField /> */}
      </div>
      <Condition is={state.value.length} else={<Empty loading={state.loading} />}>
        <InfiniteScroll
          next={next}
          loaded={state.loaded}
        >
          <Blocks>
            {state.value.map((item, i) => <BlockOrder key={i} data={item} />)}
          </Blocks>
        </InfiniteScroll>
      </Condition>
    </>
  )
}

export default Listed
