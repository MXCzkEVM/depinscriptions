import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import Condition from './Condition'
import { HolderDto } from '@/api/index.type'
import { thousandBitSeparator } from '@/utils'

function BoxToken(props: { data: HolderDto }) {
  const { t } = useTranslation()
  const { address } = useAccount()
  return (
    <div className="flex rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col hover:border-purple-500 overflow-hidden hover">
      <div className="p-4 overflow-x-hidden overflow-y-auto flex-1 bg-[rgb(39,42,48)]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <div className="relative h-[140px] flex justify-center items-center flex-col">
          <div className="absolute top-0 left-0 right-0 flex justify-between">
            <div>{props.data.tick}</div>
            <Condition is={address === props.data.owner}>
              <div className="flex gap-3">
                <Button className="p-0 px-1 min-w-min" size="small">{t('Transfer')}</Button>
                <Button className="p-0 px-1 min-w-min" size="small">{t('List')}</Button>
              </div>
            </Condition>
          </div>
          <div className="text-xl">{thousandBitSeparator(props.data.value)}</div>
        </div>
      </div>
      <div className="p-4 bg-[rgb(48,52,61)] flex items-center gap-3">
        <span className="flex-1">
          #
          {props.data.number}
        </span>
      </div>
    </div>
  )
}

export default BoxToken
