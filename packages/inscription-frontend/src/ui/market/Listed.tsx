import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'
import { useInjectHolder } from '@overlays/react'
import toast from 'react-hot-toast'
import { delay } from '@hairy/utils'
import { getOrderListed } from '@/api'
import { CardContainer, CardOrder, Condition, Empty, InfiniteScroll, LimitOrderDialog, Refresh, WaitIndexDialog } from '@/components'
import { useEventBus, useRouterQuery, useServerPaginationConcat, useWhenever } from '@/hooks'

function Listed() {
  const tick = useRouterQuery('token')
  const { t } = useTranslation()

  const [limitOrderHolder, openLimitOrderDialog] = useInjectHolder<any, any>(LimitOrderDialog)
  const [holderWaitIndex, openWaitIndexDialog] = useInjectHolder(WaitIndexDialog)

  const { emit: reloadPage, on: onReloadPage } = useEventBus('reload:page')
  const [state, { reload, next }] = useServerPaginationConcat({
    resolve: model => getOrderListed({ ...model, tick }),
  })

  async function purchases() {
    const { hash } = await openLimitOrderDialog({ token: tick })
    await openWaitIndexDialog({ hash })
    toast.success(t('Purchase successful'), { position: 'top-center' })
    await delay(500)
    reloadPage()
  }

  useWhenever(tick, reload)
  onReloadPage(reload)
  return (
    <>
      {limitOrderHolder}
      {holderWaitIndex}
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
        <Button
          className="market_detail_step_3"
          onClick={purchases}
          variant="contained"
        >
          {t('Limit Order')}
        </Button>
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
