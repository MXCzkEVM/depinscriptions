import { useEffect, useState } from 'react'
import { useAsyncFn, useMount } from 'react-use'
import Condition from './Condition'
import { BoxScription, Empty } from '.'
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

  const [state, fetchInscriptions] = useAsyncFn(async (page: number) => {
    if (fetched)
      return
    const { data } = await getInscription({ page, limit: 12, owner: props.address || '' })
    if (page === 1)
      setInscriptions([...data])
    else
      setInscriptions([...inscriptions, ...data])
    setPage(page)
    setFetched(!data.length)
  }, [props.address])

  useMount(() => fetchInscriptions(page))

  useMittOn('reload:page', () => fetchInscriptions(page))
  useEffect(() => {
    fetchInscriptions(page)
  }, [props.address])
  return (
    <Condition is={inscriptions.length} else={<Empty loading={state.loading} />}>
      <div className="grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]">
        {inscriptions.map(item => <BoxScription key={item.hash} data={item} />)}
      </div>
    </Condition>
  )
}

export default DataGridScriptions
