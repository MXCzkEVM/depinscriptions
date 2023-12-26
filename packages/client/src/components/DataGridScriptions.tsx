import { useEffect, useState } from 'react'
import { useAsyncFn, useMount } from 'react-use'
import { LoadingButton } from '@mui/lab'
import Condition from './Condition'
import { BoxScription, Empty, InfiniteScroll } from '.'
import { InscriptionDto } from '@/api/index.type'
import { getInscription } from '@/api'
import { useMittOn } from '@/hooks/useMittOn'
import { useServerPaginationConcat, useWatch } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

export interface DataGridScriptionsProps {
  address?: string
}

function DataGridScriptions(props: DataGridScriptionsProps) {
  const [state, { reload, next }] = useServerPaginationConcat({
    limit: 5,
    resolve: model => getInscription({ ...model, owner: props.address || '' }),
  })

  useMittOn('reload:page', reload)
  useWhenever(props.address, reload)
  useMount(reload)
  return (
    <Condition is={state.value.length} else={<Empty loading={state.loading} />}>
      <InfiniteScroll
        loader={(
          <div className="flex justify-center py-2">
            <LoadingButton />
          </div>
        )}
        next={next}
        loaded={state.loaded}
      >
        <div className="grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]">
          {state.value.map((item, i) => <BoxScription key={i} data={item} />)}
        </div>
      </InfiniteScroll>
    </Condition>
  )
}

export default DataGridScriptions
