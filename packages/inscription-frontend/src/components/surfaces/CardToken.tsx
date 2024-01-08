import { Link } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useInjectHolder } from '@overlays/react'
import classnames from 'classnames'
import { Condition } from '../utils'
import { TransferDialog, TransferDialogProps, TransferDialogResolved, WaitIndexDialog } from '../dialog'

import { Flag } from './Flag'
import { Holder } from '@/api/index.type'
import { thousandBitSeparator } from '@/utils'
import { useEventBus } from '@/hooks'

export function CardToken(props: { data: Holder, guide?: boolean }) {
  const { t } = useTranslation()
  const { address } = useAccount()
  const [holderTransferMl, openTransferModal] = useInjectHolder<TransferDialogProps, TransferDialogResolved>(TransferDialog)
  const [holderWaitingMl, openWaitIndexDialog] = useInjectHolder(WaitIndexDialog)
  const { emit: reload } = useEventBus('reload:page')

  async function transfer() {
    const { hash } = await openTransferModal({ holder: props.data })
    await openWaitIndexDialog({ hash })
    reload()
  }

  return (
    <div className="flex rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col hover:border-purple-500 overflow-hidden hover">
      <div className="p-4 bg-[rgb(39,42,48)]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <div className="h-[140px] relative">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span>{props.data.tick}</span>
              <Flag text={false} find={props.data.tick} />
            </div>
            <Condition is={address === props.data.owner}>
              <div className="flex gap-3 relative z-10">
                <Link className={classnames([props.guide && 'personal_page_step_1', 'cursor-pointer text-sm min-w-min'])} onClick={transfer}>{t('Transfer')}</Link>
                {/* <Link className={classnames([props.guide && 'personal_page_step_2', 'cursor-pointer text-sm min-w-min'])}>{t('List')}</Link> */}
              </div>
            </Condition>
          </div>
          <div className="mt-10 flex justify-center items-center text-xl font-bold">{thousandBitSeparator(props.data.value)}</div>
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
