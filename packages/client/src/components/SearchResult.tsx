import { Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import DataGridTokens from './DataGridTokens'
import DataGridScriptions from './DataGridScriptions'
import Refresh from './Refresh'

export interface SearchResultProps {
  address?: string
}

export function SearchResult(props: SearchResultProps) {
  const [tab, setTab] = useState(0)
  return (
    <>
      <div className="flex">
        <Tabs value={tab} onChange={(event, value) => setTab(value)}>
          <Tab label="Tokens" />
          <Tab label="Scriptions" />
        </Tabs>
        <div className="ml-12 flex items-center">
          <Refresh />
        </div>
      </div>
      {
        tab === 0
          ? <DataGridTokens address={props.address} />
          : <DataGridScriptions address={props.address} />
      }
    </>
  )
}
