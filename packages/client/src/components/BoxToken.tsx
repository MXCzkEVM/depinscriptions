import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { HolderDto } from '@/api/index.type'
import { thousandBitSeparator } from '@/utils'

function BoxToken(props: { data: HolderDto }) {
  return (
    <div className="flex rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col hover:border-purple-500 cursor-pointer overflow-hidden hover">
      <div className="p-4 overflow-x-hidden overflow-y-auto flex-1 bg-[rgb(39,42,48)]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <div className="relative h-[140px] flex justify-center items-center flex-col">
          <div className="absolute top-0 left-0">
            {props.data.tick}
          </div>
          <div className="text-xl">{thousandBitSeparator(props.data.value)}</div>
        </div>
      </div>
      <div className="p-4 bg-[rgb(48,52,61)]">
        #
        {props.data.number}
      </div>
    </div>
  )
}

export default BoxToken
