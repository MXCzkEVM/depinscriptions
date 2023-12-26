import { useEffect, useState } from 'react'
import { useAsyncFn } from 'react-use'
import { LoadingButton } from '@mui/lab'
import Condition from './Condition'
import { BoxScription, Empty, InfiniteScroll } from '.'
import { InscriptionDto } from '@/api/index.type'
import { getInscription } from '@/api'
import { useMittOn } from '@/hooks/useMittOn'

export interface DataGridScriptionsProps {
  address?: string
}

function DataGridScriptions(props: DataGridScriptionsProps) {
  const [page, setPage] = useState(1)
  const [inscriptions, setInscriptions] = useState<InscriptionDto[]>([])
  const [fetched, setFetched] = useState(false)

  const [state, fetch] = useAsyncFn(async (page: number, reload = false) => {
    if (fetched && reload === false)
      return
    const { data } = await getInscription({ page, limit: 24, owner: props.address || '' })
    if (page === 1)
      setInscriptions([...data])
    else
      setInscriptions(prev => [...prev, ...data])
    setPage(page)
    setFetched(data.length < 24)
  }, [props.address])

  useMittOn('reload:page', () => fetch(1))

  useEffect(() => {
    fetch(1, true)
  }, [props.address])

  return (
    <Condition is={inscriptions.length} else={<Empty loading={state.loading} />}>
      <InfiniteScroll
        loader={(
          <div className="flex justify-center py-2">
            <LoadingButton />
          </div>
        )}
        next={() => fetch(page + 1)}
        loaded={fetched}
      >
        <div className="grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]">
          {inscriptions.map((item, i) => <BoxScription key={i} data={item} />)}
        </div>
      </InfiniteScroll>
    </Condition>
  )
}

export default DataGridScriptions
