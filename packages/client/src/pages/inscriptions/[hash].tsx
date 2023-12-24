import { Card, CardContent } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import type { ReactElement } from 'react'
import { Layout } from '@/layout'
import { Empty, FieldCol, LocationForHexagon } from '@/components'
import { useAsync } from 'react-use'
import { useRouterQuery } from '@/hooks'
import { getInscriptionHash } from '@/api'
import { cover, noop, thousandBitSeparator } from '@/utils'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

function Page() {
  const hash = useRouterQuery('hash')
  const { t } = useTranslation()

  const columns: GridColDef[] = [
    { field: 'event', headerName: 'Event', minWidth: 60, flex: 1 },
    { field: 'from', headerName: 'From', minWidth: 120, flex: 1 },
    { field: 'to', headerName: 'To', minWidth: 120, flex: 1 },
    { field: 'time', headerName: 'Time', minWidth: 180, flex: 1 },
  ]

  const { value: data, loading } = useAsync(async () => getInscriptionHash({ hash }))



  if (!data)
    return <Empty loading={loading} />

  const rows = [
    {
      event: 'Mint',
      from: cover(data.from, [6, 3, 4]),
      to: cover(data.to, [6, 3, 4]),
      time: dayjs(data.time).format('YYYY/MM/DD HH:mm:ss')
    },
  ]

  return (
    <div className="flex w-full mt-10 gap-6 flex-col lg:flex-row">
      <Card className="flex-1 lg:min-w-[360px]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className="p-6">
          <div className="h-[340px] bg-black bg-opacity-25 flex justify-center items-center mb-7">
            <pre className="text-lg">
              {data.json}
            </pre>
          </div>
          <div className="grid grid-cols-2 gap-y-6">
            <FieldCol dir="col" label="Scription Number">
              {data.number}
            </FieldCol>
            <FieldCol dir="col" label="Creator">
              {cover(data.from, [6, 3, 4])}
            </FieldCol>
            <FieldCol dir="col" label="Owner">
              {cover(data.from, [6, 3, 4])}
            </FieldCol>
            <FieldCol dir="col" label="Mime Type">
              text/plain
            </FieldCol>
            <FieldCol dir="col" label="Created">
              {dayjs(data.time).fromNow()}
            </FieldCol>
            <FieldCol dir="col" label="Location">
              <LocationForHexagon hexagon="" />
            </FieldCol>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:w-[800px]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <span className="font-bold text-2xl mr-1">{data.tick}</span>
            <span className="text-gray-400">#{data.number}</span>
          </div>
          <div className="flex mb-8">
            <FieldCol className="flex-1" dir="col" label="Supply">
              {thousandBitSeparator(data.supply)}
            </FieldCol>
            <FieldCol className="flex-1" dir="col" label="Holders">
              {thousandBitSeparator(data.holders)}
            </FieldCol>
            <FieldCol className="flex-1" dir="col" label="Creator">
              {cover(data.from, [6, 3, 4])}
            </FieldCol>
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
