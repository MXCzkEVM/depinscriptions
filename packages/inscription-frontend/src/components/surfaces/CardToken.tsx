import { Link } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useInjectHolder } from '@overlays/react'
import classnames from 'classnames'
import { Condition } from '../utils'
import { TransferDialog, TransferDialogProps, TransferDialogResolved, WaitIndexDialog } from '../dialog'

import { Flag } from './Flag'
import CardDefault from './CardDefault'
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

  function renderFooter() {
    return (
      <span className="flex-1">
        #
        {props.data.number}
      </span>
    )
  }

  return (
    <CardDefault footer={renderFooter()} footerClass="personal_page_step_1 personal_page_step_2">
      <div className="h-[80px] sm:h-[140px] flex flex-col items-center">
        <div className="w-full flex justify-between">
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
        <div className="flex-1 flex items-center text-xl font-bold">{thousandBitSeparator(props.data.value)}</div>
      </div>
      {holderTransferMl}
      {holderWaitingMl}
    </CardDefault>
  )
}
