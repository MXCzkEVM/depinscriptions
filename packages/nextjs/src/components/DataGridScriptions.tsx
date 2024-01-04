import { useMount } from 'react-use'
import Condition from './Condition'
import Blocks from './Blocks'
import { BlockScription, Empty, InfiniteScroll } from '.'
import { getInscription } from '@/api'
import { useEventBus, useServerPaginationConcat } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

export interface DataGridScriptionsProps {
  address?: string
}

function DataGridScriptions(props: DataGridScriptionsProps) {
  const [state, { reload, next }] = useServerPaginationConcat({
    resolve: model => getInscription({ ...model, owner: props.address || '' }),
  })

  useEventBus('reload:page').on(reload)
  useWhenever(props.address, reload)
  useMount(reload)
  return (
    <Condition is={state.value.length} else={<Empty loading={state.loading} />}>
      <InfiniteScroll
        next={next}
        loaded={state.loaded}
      >
        <Blocks>
          {state.value.map((item, i) => <BlockScription key={i} data={item} />)}
        </Blocks>
      </InfiniteScroll>
    </Condition>
  )
}

export default DataGridScriptions
