import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import BoxDefault from './BoxDefault'
import ChainLink from './ChainLink'
import { InscriptionDto } from '@/api/index.type'
import { cover } from '@/utils'

function BoxScription(props: { data: InscriptionDto }) {
  const router = useRouter()

  function renderFooter() {
    return (
      <>
        <div className="flex justify-between items-center text-base mb-3">
          <span className="truncate inline-block max-w-[50%]">
            #
            {' '}
            {props.data.number}
          </span>
          <span className="truncate inline-block text-sm">
            {cover(props.data.from, [4, 3, 4])}
          </span>
        </div>
        <div className="text-sm">
          <span className="mr-2">Created</span>
          <span>{dayjs(props.data.time).fromNow()}</span>
        </div>
      </>
    )
  }
  return (
    <BoxDefault footer={renderFooter()} onClick={() => router.push(`/inscriptions/${props.data.hash}`)}>
      <pre className="text-sm break-all whitespace-pre-wrap">
        {JSON.stringify(JSON.parse(props.data.json), null, 1)
          .replace('{', '')
          .replace('}', '')
          .replace(/ /g, '')
          .replace(/,/g, '')
          .trim()}
      </pre>
    </BoxDefault>
  )
}

export default BoxScription
