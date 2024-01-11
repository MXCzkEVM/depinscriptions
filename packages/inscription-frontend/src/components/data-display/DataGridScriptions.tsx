import { useMount } from 'react-use'
import { Condition, Empty, InfiniteScroll } from '../utils'
import { CardContainer, CardScription } from '../surfaces'
import { getInscription } from '@/api'
import { useEventBus, useServerPaginationConcat, useWhenever } from '@/hooks'

export interface DataGridScriptionsProps {
  address?: string
}

export function DataGridScriptions(props: DataGridScriptionsProps) {
  const [state, { reload, next }] = useServerPaginationConcat({
    resolve: model => getInscription({ ...model, owner: props.address || '' }),
  })

  useEventBus('reload:page').on(reload)
  useWhenever(props.address, reload)
  useMount(reload)
  return (
    <Condition is={state.value.length && !state.reloading} else={<Empty loading={state.loading} />}>
      <InfiniteScroll
        next={next}
        loaded={state.loaded}
      >
        <CardContainer>
          {state.value.map((item, i) => <CardScription key={i} data={item} />)}
        </CardContainer>
      </InfiniteScroll>
    </Condition>
  )
}
