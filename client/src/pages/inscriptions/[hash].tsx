import { Card, CardContent } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import type { ReactElement } from 'react'
import { Layout } from '@/layout'
import { FieldCol } from '@/components'

function Page() {
  const text = `  {
    "p": "asc-20",
    "op": "mint",
    "tick": "dino",
    "amt": "100000000"
  }`

  const columns: GridColDef[] = [
    { field: 'event', headerName: 'Event', minWidth: 60, flex: 1 },
    { field: 'from', headerName: 'From', minWidth: 120, flex: 1 },
    { field: 'to', headerName: 'To', minWidth: 120, flex: 1 },
    { field: 'time', headerName: 'Time', minWidth: 180, flex: 1 },
  ]
  const rows = [
    { event: 'Mint', from: '0x647b...c740', to: '0x647b...c740', time: '2023/12/20 17:15:35' },
  ]

  return (
    <div className="flex w-full mt-10 gap-6 flex-col lg:flex-row">
      <Card className="flex-1 lg:min-w-[360px]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className="p-6">
          <div className="h-[340px] bg-black bg-opacity-25 flex justify-center items-center mb-7">
            <pre className="text-lg">
              {text}
            </pre>
          </div>
          <div className="grid grid-cols-2 gap-y-6">
            <FieldCol dir="col" label="Scription Number">
              74906402
            </FieldCol>
            <FieldCol dir="col" label="Creator">
              0x601d...6181
            </FieldCol>
            <FieldCol dir="col" label="Owner">
              0x64f9...0109
            </FieldCol>
            <FieldCol dir="col" label="Mime Type">
              text/plain
            </FieldCol>
            <FieldCol dir="col" label="Created">
              a few seconds ago
            </FieldCol>
            <FieldCol dir="col" label="Location">
              China, Guangdong, Shenzhen
            </FieldCol>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:w-[800px]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <span className="font-bold text-2xl mr-1">dino</span>
            <span className="text-gray-400">#26179229</span>
          </div>
          <div className="flex mb-8">
            <FieldCol className="flex-1" dir="col" label="Supply">
              2,100,000,000,000,000
            </FieldCol>
            <FieldCol className="flex-1" dir="col" label="Holders">
              40,292
            </FieldCol>
            <FieldCol className="flex-1" dir="col" label="Creator">
              0x647b...c740
            </FieldCol>
          </div>
          <div className="flex items-center mb-4 font-bold text-2xl">
            Activity
          </div>
          <DataGrid
            className="border-none"
            rows={rows}
            getRowId={row => row.from}
            columns={columns}
            hideFooterSelectedRowCount
            slots={{ pagination: (): any => {} }}
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
