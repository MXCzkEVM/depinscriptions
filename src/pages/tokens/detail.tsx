import { Layout } from "@/layout"
import { ReactElement, useState } from "react"
import { } from '@hairy/utils'
import { useRouterParams, useSendSatsTransaction } from "@/hooks"
import { FieldCol, Icon, LinearProgressWithLabel } from "@/components"
import { ArrowBackSharp } from "@ricons/ionicons5"
import { Button, Card, CardContent, Divider, Tab, Tabs } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { MOCK_HOLDERS } from "@/config"
import { useRouter } from "next/router"
import { LoadingButton } from "@mui/lab"
import { useAccount } from "wagmi"

function Page() {
  const router = useRouter()
  const token = useRouterParams('token', { replace: '/tokens' })
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const columns: GridColDef[] = [
    {
      field: 'rank', headerName: 'Rank', minWidth: 120, renderCell() {
        return 1
      },
    },
    {
      field: 'address', headerName: 'Address', minWidth: 180, flex: 1,
    },
    {
      field: 'percentage', headerName: 'Percentage', flex: 1,
      renderCell() {
        return <div className='w-[122px] mr-6'>
          <LinearProgressWithLabel value={100} />
        </div>
      },
    },
    { field: 'value', headerName: 'Value', minWidth: 150 },
  ];
  const { address } = useAccount()
  const { isLoading, sendTransaction } = useSendSatsTransaction({
    data: {
      tick: token,
      p: "msc-20",
      op: "mint",
      amt: '2',
      hex: '#fff'
    },
    onSuccess(data) {
      const resolved = {
        hash: data.hash,
        json: data.json,
        op: 'mint',
        tick: token,
        from: address,
        to: address,
      }
      console.log(resolved)
    },
  })

  return <>
    <div className="flex items-center mt-[3.125rem] mb-[2.25rem] gap-2 cursor-pointer" onClick={() => router.replace('/tokens')}>
      <Icon>
        <ArrowBackSharp />
      </Icon>
      <span className="text-2xl">{token}</span>
      <div className="bg-white text-xs py-[2px] px-[4px] rounded-lg bg-opacity-30">
        MSC-20
      </div>
    </div>
    <div className="mb-[1.75rem]">
      <LinearProgressWithLabel height="8px" value={100} />
    </div>
    <Card className="mb-6" style={{ background: 'rgb(22 21 21 / 20%)' }}>
      <CardContent>
        <div className="mb-3 flex justify-between">
          <span className="text-xl font-bold">Overview</span>
          <LoadingButton loading={isLoading} variant="contained" onClick={() => sendTransaction?.()}>
            Mint Directly
          </LoadingButton>
        </div>
        <Divider />
        <FieldCol label="Scription ID">
          0x3fcf9252b5b0b940080f4f318208221e34691340f0a9a53d1b107b0a61b0cf10
        </FieldCol>
        <FieldCol label="Total Supply">
          1463636349000000
        </FieldCol>
        <FieldCol label="Minted">
          1463636349000000
        </FieldCol>
        <FieldCol label="Limit Per Mint">
          69696969
        </FieldCol>
        <FieldCol label="Decimal">
          0
        </FieldCol>
        <FieldCol label="Deploy By">
          0x364af27a926c472cdaae251c8eedf6af7e39d234
        </FieldCol>
        <FieldCol label="Deploy Time">
          2023/12/17 11:01:10
        </FieldCol>
        <FieldCol label="Completed Time">
          2023/11/25 12:54:24
        </FieldCol>
        <FieldCol label="Holders">
          21,105,828
        </FieldCol>
        <FieldCol label="Total Transactions">
          21,105,828
        </FieldCol>
      </CardContent>
    </Card>
    <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
      <CardContent>
        <Tabs
          variant='fullWidth'
          onChange={handleChange}
          value={value}
        >
          <Tab disableRipple label="Holders" />
          <Tab disableRipple label="Hexagons" />
        </Tabs>
        <DataGrid
          className='border-none data-grid-with-row-pointer'
          rows={MOCK_HOLDERS}
          getRowId={(row) => row.address}
          columns={columns}
          hideFooterSelectedRowCount
        />
      </CardContent>
    </Card>
  </>
}

Page.layout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page