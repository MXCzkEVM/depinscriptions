import { useTranslation } from 'react-i18next'
import { getOrderListed } from '@/api'
import { CardContainer, CardOrder, Condition, Empty, InfiniteScroll, Refresh } from '@/components'
import { useEventBus, useRouterQuery, useServerPaginationConcat, useWhenever } from '@/hooks'

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
      </div>
      <Condition is={state.value.length} else={<Empty loading={state.loading} />}>
        <InfiniteScroll
          next={next}
          loaded={state.loaded}
        >
          <CardContainer>
            {state.value.map((item, i) => <CardOrder key={i} data={item} />)}
          </CardContainer>
        </InfiniteScroll>
      </Condition>
    </>
  )
}

export default Listed
