import { Card, CardContent } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import type { ReactElement } from 'react'
import { useAsync } from 'react-use'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Layout } from '@/layout'
import {
  ChainLink,
  Condition,
  Empty,
  Flag,
  LocationForHexagon,
  TextColumn,
} from '@/components'
import { useRouterQuery } from '@/hooks'
import { getInscriptionHash } from '@/api'
import { noop, thousandBitSeparator } from '@/utils'

function Page() {
  const hash = useRouterQuery('hash')
  const { t } = useTranslation()

  const columns: GridColDef[] = [
    { field: 'event', headerName: 'Event', minWidth: 60, flex: 1 },
    {
      field: 'from',
      headerName: 'From',
      minWidth: 120,
      flex: 1,
      renderCell(params) {
        return <ChainLink type="address" href={params.row.from} />
      },
    },
    {
      field: 'to',
      headerName: 'To',
      minWidth: 120,
      flex: 1,
      renderCell(params) {
        return <ChainLink type="address" href={params.row.to} />
      },
    },
    { field: 'time', headerName: 'Time', minWidth: 180, flex: 1 },
  ]

  const { value: data, loading } = useAsync(async () => getInscriptionHash({ hash }))

  if (!data)
    return <Empty loading={loading} />

  const inscription = JSON.parse(data.json)

  const rows = [
    {
      event: inscription.op,
      from: data.from,
      to: data.to,
      time: dayjs(data.time).format('YYYY/MM/DD HH:mm:ss'),
    },
  ]

  return (
    <div className="flex w-full mt-10 gap-6 flex-col lg:flex-row">
      <Card className="flex-1 lg:min-w-[360px]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className="p-6">
          <div className="h-[340px] bg-black bg-opacity-25 flex justify-center items-center mb-7">
            <pre className="text-lg">
              {JSON.stringify(inscription, null, 2)}
            </pre>
          </div>
          <div className="grid grid-cols-2 gap-y-6">
            <TextColumn dir="col" label="Scription Number">
              {data.number}
            </TextColumn>
            <TextColumn dir="col" label="Creator">
              <ChainLink type="address" href={data.from} />
            </TextColumn>
            <TextColumn dir="col" label="Owner">
              <ChainLink type="address" href={data.from} />
            </TextColumn>
            <TextColumn dir="col" label="Mime Type">
              text/plain
            </TextColumn>
            <TextColumn dir="col" label="Created">
              {dayjs(data.time).fromNow()}
            </TextColumn>
            <Condition is={inscription.hex}>
              <TextColumn dir="col" label="Location">
                <LocationForHexagon hexagon={inscription.hex} />
              </TextColumn>
            </Condition>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:w-[800px]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <span className="font-bold text-2xl mr-1">
              <Flag find={data.tick} />
            </span>
            <span className="text-gray-400">
              #
              {data.number}
            </span>
          </div>
          <div className="flex mb-8">
            <TextColumn className="flex-1" dir="col" label="Supply">
              {thousandBitSeparator(data.supply)}
            </TextColumn>
            <TextColumn className="flex-1" dir="col" label="Holders">
              {thousandBitSeparator(data.holders)}
            </TextColumn>
            <TextColumn className="flex-1" dir="col" label="Creator">
              <ChainLink type="address" href={data.from} />
            </TextColumn>
          </div>
          <div className="flex items-center mb-4 font-bold text-2xl">
            {t('Activity')}
          </div>
          <DataGrid
            className="border-none"
            rows={rows}
            getRowId={row => row.from}
            columns={columns}
            hideFooterSelectedRowCount
            slots={{ pagination: noop }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
