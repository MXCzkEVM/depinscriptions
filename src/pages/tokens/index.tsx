import { Layout } from '@/layout'
import { Button, CardContent, Tab, Tabs, TextField, Typography } from '@mui/material'
import { ReactElement } from 'react'
import React from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Card } from '@mui/material'
import { MOCK_TOKENS } from '@/config'
import { LinearProgressWithLabel } from '@/components';
import dayjs from 'dayjs'

const columns: GridColDef[] = [
  { field: 'tick', headerName: 'Token', minWidth: 120, flex: 1 },
  {
    field: 'createdAt', headerName: 'Deploy Time', minWidth: 180, flex: 1,
    renderCell(params) {
      return dayjs(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    field: 'minted', headerName: 'Progress', minWidth: 210, flex: 1,
    renderCell() {
      return <div className='w-full mr-6'>
        <LinearProgressWithLabel value={100} />
      </div>
    },
  },
  { field: 'holder', headerName: 'Holder', minWidth: 150, flex: 1 },
  {
    field: 'trxs', headerName: 'Transactions', minWidth: 180, flex: 1,
    renderCell(params) {
      return (
        <div className='flex justify-between w-full'>
          <span>{params.row.trxs}</span>
          <div>》</div>
        </div>
      )
    },
  },
];


// Retrieve tokens deployed by a user
function Page() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="mx-auto mt-9 mb-14 w-full text-center">
        <span className="md:text-3xl text-center mt-[41px] mp:mb-[18px] select-none text-[#6300ff]"> Check out mxc-20 balance of the address. </span>
      </div>
      <div className='flex justify-center'>
        <TextField className='md:w-[672px] w-full' color='secondary' size="small" variant="outlined" placeholder='0x...5e0d7A' />
      </div>
      <div className='text-center my-10 select-none'> Recognize all operations including DEPLOY, MINT and TRANSFER. </div>
      <div className='mb-4 flex justify-between'>
        <Typography variant='h6' component="span">
          The full list of tokens
        </Typography>
        <Button type="button" variant='contained'>Deploy</Button>
      </div>
      <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent>
          <div className='mb-4 flex justify-between items-center'>
            <Tabs
              variant='standard'
              onChange={handleChange}
              value={value}
            >
              <Tab disableRipple label="All" />
              <Tab disableRipple label="In-Progress" />
              <Tab disableRipple label="Completed" />
            </Tabs>
            <TextField className='hidden md:block' color='secondary' size="small" variant="outlined" placeholder='Ava' />
          </div>
          <DataGrid
            className='border-none data-grid-with-row-pointer'
            rows={MOCK_TOKENS}
            getRowId={(row) => row.tick}
            columns={columns}
            hideFooterSelectedRowCount
            onRowClick={() => {console.log('----')}}
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
