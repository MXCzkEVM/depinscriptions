/* eslint-disable no-alert */
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'
import { Layout } from '@/layout'
import { DataGridScriptions, Refresh } from '@/components'

function Page() {
  const { t } = useTranslation()

  async function onConnect() {
    const accounts = await window.ethereum?.request({
      method: 'eth_requestAccounts',
    })
    alert(accounts)
  }

  return (
    <>
      <Button type="button" variant="contained" onClick={onConnect}>TEST</Button>
      <div className="my-first-step flex justify-between mt-[30px]">
        <span className="my-other-step text-xl sm:text-2xl text-primary font-bold">{t('Latest Scriptions')}</span>
        <Refresh />
      </div>
      <DataGridScriptions />
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
