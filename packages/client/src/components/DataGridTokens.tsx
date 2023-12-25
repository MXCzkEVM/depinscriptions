import { useState } from 'react'
import { useAsyncFn, useMount } from 'react-use'
import Condition from './Condition'
import Empty from './Empty'
import BoxToken from './BoxToken'
import { HolderDto } from '@/api/index.type'
import { getHolder } from '@/api'
import { useMittOn } from '@/hooks/useMittOn'

export interface DataGridTokensProps {
  address?: string
}

function DataGridTokens(props: DataGridTokensProps) {
  const [page, setPage] = useState(1)
  const [tokens, setTokens] = useState<HolderDto[]>([])
  const [fetched, setFetched] = useState(false)

  const [state, fetch] = useAsyncFn(async (page: number) => {
    if (fetched)
      return
    const { data } = await getHolder({ page, limit: 12, owner: props.address || '' })
    if (page === 1)
      setTokens([...data])
    else
      setTokens([...tokens, ...data])
    setPage(page)
    setFetched(!data.length)
  }, [props.address])

  useMount(() => fetch(page))
  useMittOn('reload:page', () => fetch(page))

  return (
    <Condition is={tokens.length} else={<Empty loading={state.loading} />}>
      <div className="grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]">
        {tokens.map(item => <BoxToken key={item.id} data={item} />)}
      </div>
    </Condition>
  )
}

export default DataGridTokens
