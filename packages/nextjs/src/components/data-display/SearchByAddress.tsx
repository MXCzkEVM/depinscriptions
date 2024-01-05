import { Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Refresh } from '../utils'
import { DataGridScriptions, DataGridTokens } from '.'

export interface SearchByAddressProps {
  address?: string
}

export function SearchByAddress(props: SearchByAddressProps) {
  const [tab, setTab] = useState(0)
  const { t } = useTranslation()
  return (
    <>
      <div className="flex">
        <Tabs value={tab} onChange={(event, value) => setTab(value)}>
          <Tab label={t('Tokens')} />
          <Tab label={t('Scriptions')} className="personal_page_step_3" />
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
