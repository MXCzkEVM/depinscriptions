import { NextPageWithLayout } from './_app'
import Layout from '@layout/Layout'
import { Button, CardContent, Tab, Tabs, TextField, Typography } from '@mui/material'
import { ReactElement } from 'react'
import React from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Card } from '@mui/material'

const columns: GridColDef[] = [
  { field: 'tick', headerName: 'Token', minWidth: 240 },
  { field: 'createdAt', headerName: 'Deploy Time', minWidth: 240 },
  { field: 'progress', headerName: 'Progress', minWidth: 210 },
  { field: 'holders', headerName: 'Holder', minWidth: 150 },
  { field: 'trxs', headerName: 'Transactions', minWidth: 180 },
];

const rows = [
  {
    "tick": "avav",
    "number": "22126343",
    "precision": 0,
    "max": "1463636349000000",
    "limit": "69696969",
    "minted": "1463636349000000",
    "holders": 50516,
    "progress": 1000000,
    "trxs": 21099075,
    "createdAt": 1700888064,
    "completedAt": 1702782070
  },
  {
    "tick": "dino",
    "number": "26179229",
    "precision": 0,
    "max": "2100000000000000",
    "limit": "100000000",
    "minted": "1194720944651456",
    "holders": 41306,
    "progress": -2055,
    "trxs": 11984858,
    "createdAt": 1702042349,
    "completedAt": 0
  },
  {
    "tick": "aval",
    "number": "191987",
    "precision": 0,
    "max": "2100000000000000",
    "limit": "100000000",
    "minted": "2100000000000000",
    "holders": 22916,
    "progress": 1000000,
    "trxs": 21001444,
    "createdAt": 1700325965,
    "completedAt": 1700727864
  },
  {
    "tick": "BEEG",
    "number": "59894737",
    "precision": 0,
    "max": "1000000000",
    "limit": "1000",
    "minted": "1000000000",
    "holders": 12253,
    "progress": 1000000,
    "trxs": 1018160,
    "createdAt": 1702846912,
    "completedAt": 1702863540
  },
  {
    "tick": "asct",
    "number": "22668540",
    "precision": 0,
    "max": "21000000",
    "limit": "2",
    "minted": "21000000",
    "holders": 9492,
    "progress": 1000000,
    "trxs": 10580599,
    "createdAt": 1701910048,
    "completedAt": 1702196919
  },
  {
    "tick": "HCTs",
    "number": "63488050",
    "precision": 0,
    "max": "210000000",
    "limit": "1000",
    "minted": "210000000",
    "holders": 4207,
    "progress": 1000000,
    "trxs": 214667,
    "createdAt": 1702900906,
    "completedAt": 1702906358
  },
  {
    "tick": "Tduck",
    "number": "45659830",
    "precision": 0,
    "max": "210000000",
    "limit": "1000",
    "minted": "210000000",
    "holders": 3092,
    "progress": 1000000,
    "trxs": 212097,
    "createdAt": 1702620600,
    "completedAt": 1702869585
  },
  {
    "tick": "ascv",
    "number": "36234231",
    "precision": 0,
    "max": "100000000",
    "limit": "100000000",
    "minted": "100000000",
    "holders": 1893,
    "progress": 1000000,
    "trxs": 16910,
    "createdAt": 1702455024,
    "completedAt": 1702455225
  },
  {
    "tick": "avas",
    "number": "1",
    "precision": 0,
    "max": "21000000",
    "limit": "1000",
    "minted": "21000000",
    "holders": 1565,
    "progress": 1000000,
    "trxs": 40494,
    "createdAt": 1687969025,
    "completedAt": 1700286769
  },
  {
    "tick": "bull",
    "number": "22595911",
    "precision": 0,
    "max": "2100000000000000",
    "limit": "100000000",
    "minted": "5826400005000",
    "holders": 1426,
    "progress": 2774,
    "trxs": 58387,
    "createdAt": 1701537487,
    "completedAt": 0
  },
  {
    "tick": "BTC",
    "number": "161207",
    "precision": 0,
    "max": "21000000",
    "limit": "100",
    "minted": "21000000",
    "holders": 1081,
    "progress": 1000000,
    "trxs": 211609,
    "createdAt": 1700293534,
    "completedAt": 1702308104
  },
  {
    "tick": "beec",
    "number": "61735060",
    "precision": 0,
    "max": "21000000",
    "limit": "1000",
    "minted": "21000000",
    "holders": 997,
    "progress": 1000000,
    "trxs": 21285,
    "createdAt": 1702874393,
    "completedAt": 1702911355
  },
  {
    "tick": "atxs",
    "number": "34875831",
    "precision": 0,
    "max": "10000",
    "limit": "1",
    "minted": "10000",
    "holders": 928,
    "progress": 1000000,
    "trxs": 12488,
    "createdAt": 1702413734,
    "completedAt": 1702414291
  },
  {
    "tick": "BEEs",
    "number": "65451686",
    "precision": 0,
    "max": "21000000",
    "limit": "1000",
    "minted": "21000000",
    "holders": 924,
    "progress": 1000000,
    "trxs": 21462,
    "createdAt": 1702932299,
    "completedAt": 1702935743
  },
  {
    "tick": "spacex",
    "number": "260681",
    "precision": 0,
    "max": "21000000",
    "limit": "1000",
    "minted": "21000000",
    "holders": 897,
    "progress": 1000000,
    "trxs": 21398,
    "createdAt": 1700353563,
    "completedAt": 1702874533
  }
]
// Retrieve tokens deployed by a user
const Page: NextPageWithLayout = () => {
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
      <Card style={{background: 'rgb(22 21 21 / 20%)'}}>
        <CardContent>
          <div className='mb-4 flex justify-between items-center'>
            <Tabs
              variant='standard'
              onChange={handleChange}
              value={value}
            >
              <Tab  disableRipple label="All" />
              <Tab  disableRipple label="In-Progress" />
              <Tab  disableRipple label="Completed" />
            </Tabs>
            <TextField className='hidden md:block' color='secondary' size="small" variant="outlined" placeholder='Ava' />
          </div>
          <DataGrid
            className='border-none'
            rows={rows}
            getRowId={(row) => row.tick}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 15 },
              },
            }}
            hideFooterSelectedRowCount
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
