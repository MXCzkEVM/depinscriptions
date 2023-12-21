import { Button, Card, CardContent, Tab, Tabs, TextField, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import React from 'react'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useInjectHolder } from '@overlays/react'
import { LinearProgressWithLabel } from '@/components'
import { MOCK_TOKENS } from '@/config'
import { Layout } from '@/layout'
import DeployDialog from '@/components/DeployDialog'

const columns: GridColDef[] = [
  { field: 'tick', headerName: 'Token', minWidth: 120, flex: 1 },
  {
    field: 'createdAt',
    headerName: 'Deploy Time',
    minWidth: 180,
    flex: 1,
    renderCell(params) {
      return dayjs(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    field: 'minted',
    headerName: 'Progress',
    minWidth: 210,
    flex: 1,
    renderCell() {
      return (
        <div className="w-full mr-6">
          <LinearProgressWithLabel value={100} />
        </div>
      )
    },
  },
  { field: 'holder', headerName: 'Holder', minWidth: 150, flex: 1 },
  {
    field: 'trxs',
    headerName: 'Transactions',
    minWidth: 180,
    flex: 1,
    renderCell(params) {
      return (
        <div className="flex justify-between w-full">
          <span>{params.row.trxs}</span>
        </div>
      )
    },
  },
]

// Retrieve tokens deployed by a user
function Page() {
  const router = useRouter()
  const [value, setValue] = React.useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const [holder, openDeployDialog] = useInjectHolder<unknown, any>(DeployDialog)

  async function deploy() {
    const resolved = await openDeployDialog()
    console.log(resolved)
  }
  return (
    <>
      {holder}
      <div className="mx-auto mt-9 mb-14 w-full text-center">
        <span className="md:text-3xl text-center mt-[41px] mp:mb-[18px] select-none text-[#6300ff]"> Check out mxc-20 balance of the address. </span>
      </div>
      <div className="flex justify-center">
        <TextField className="md:w-[672px] w-full" color="secondary" size="small" variant="outlined" placeholder="0x...5e0d7A" />
      </div>
      <div className="text-center my-10 select-none"> Recognize all operations including DEPLOY, MINT and TRANSFER. </div>
      <div className="mb-4 flex justify-between">
        <Typography variant="h6" component="span">
          The full list of tokens
        </Typography>
        <Button onClick={deploy} type="button" variant="contained">Deploy</Button>
      </div>
      <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <Tabs
              variant="standard"
              onChange={handleChange}
              value={value}
            >
              <Tab disableRipple label="All" />
              <Tab disableRipple label="In-Progress" />
              <Tab disableRipple label="Completed" />
            </Tabs>
            <TextField className="hidden md:block" color="secondary" size="small" variant="outlined" placeholder="Ava" />
          </div>
          <DataGrid
            className="border-none data-grid-with-row-pointer"
            rows={MOCK_TOKENS}
            getRowId={row => row.tick}
            columns={columns}
            hideFooterSelectedRowCount
            onRowClick={({ row }) => router.push(`/tokens/detail?token=${row.tick}`)}
          />
        </CardContent>
      </Card>
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
