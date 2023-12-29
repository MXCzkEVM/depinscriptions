import { Button, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAccount, useEnsName } from 'wagmi'
import { useInjectHolder } from '@overlays/react'
import classnames from 'classnames'
import Condition from './Condition'
import CountryFlag from './CountryFlag'
import TransferDialog, { TransferDialogProps } from './TransferDialog'
import WaitingIndexModal from './WaitingIndexModal'
import Flag from './Flag'
import { HolderDto } from '@/api/index.type'
import { thousandBitSeparator } from '@/utils'
import { useEventBus } from '@/hooks'

function BoxToken(props: { data: HolderDto, guide?: boolean }) {
  const { t } = useTranslation()
  const { address } = useAccount()
  const [holderTransferMl, openTransferModal] = useInjectHolder<TransferDialogProps, { hash: string }>(TransferDialog as any)
  const [holderWaitingMl, openWaitingIndexModal] = useInjectHolder(WaitingIndexModal)
  const { emit: reload } = useEventBus('reload:page')

  async function transfer() {
    const { hash } = await openTransferModal({ holder: props.data })
    await openWaitingIndexModal({ hash })
    reload()
  }

  return (
    <div className="flex rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col hover:border-purple-500 overflow-hidden hover">
      <div className="p-4 bg-[rgb(39,42,48)]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <div className="h-[140px] relative">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span>{props.data.tick}</span>
              <Flag find={props.data.tick} />
            </div>
            <Condition is={address === props.data.owner}>
              <div className="flex gap-3 relative z-10">
                <Link className={classnames([props.guide && 'personal_page_step_1', 'cursor-pointer text-sm min-w-min'])} onClick={transfer}>{t('Transfer')}</Link>
                <Link className={classnames([props.guide && 'personal_page_step_2', 'cursor-pointer text-sm min-w-min'])}>{t('List')}</Link>
              </div>
            </Condition>
          </div>
          <div className="absolute inset-0 flex justify-center items-center">{thousandBitSeparator(props.data.value)}</div>
        </div>
      </div>
      <div className="personal_page_step_1 personal_page_step_2 p-4 bg-[rgb(48,52,61)] flex items-center gap-3">
        <span className="flex-1">
          #
          {props.data.number}
        </span>
      </div>
      {holderTransferMl}
      {holderWaitingMl}
    </div>
  )
}

export default BoxToken
