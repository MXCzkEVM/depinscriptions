import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { InscriptionDto } from '@/api/index.type'
import { cover } from '@/utils'

function Scription(props: { data: InscriptionDto }) {
  const router = useRouter()
  return (
    <div className="flex rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col hover:border-purple-500 cursor-pointer overflow-hidden hover" onClick={() => router.push(`/inscriptions/${props.data.hash}`)}>
      <div className="p-4 overflow-x-hidden overflow-y-auto flex-1 bg-[rgb(39,42,48)]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <pre className="text-sm break-all whitespace-pre-wrap">
          {JSON.stringify(JSON.parse(props.data.json), null, 2)}
        </pre>
      </div>
      <div className="p-4 bg-[rgb(48,52,61)]">
        <div className="flex justify-between items-center text-base mb-3">
          <span className="truncate inline-block max-w-[50%]">
            #
            {' '}
            {props.data.number}
          </span>
          <span className="truncate inline-block max-w-[50%]">
            {cover(props.data.from, [6, 3, 6])}
          </span>
        </div>
        <div className="text-sm">
          <span className="mr-2">Created</span>
          <span>{dayjs(props.data.time).fromNow()}</span>
        </div>
      </div>
    </div>
  )
}

export default Scription
