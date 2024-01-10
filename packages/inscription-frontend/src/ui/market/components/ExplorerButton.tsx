import { ArrowRedoCircleOutline } from '@ricons/ionicons5'
import Link from 'next/link'
import { Order } from '@/api/index.type'
import { Condition, Icon } from '@/components'

export interface ExplorerButtonProps {
  row: Order
  hidden?: boolean
  className?: string
}

const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER!

export function ExplorerButton(props: ExplorerButtonProps) {
  return (
    <Condition is={props.hidden !== true}>
      <Link className="hidden sm:inline-flex items-center" color="inherit" target="_blank" href={`${EXPLORER_URL}/tx/${props.row.hash}`}>
        <Icon className="cursor-pointer">
          <ArrowRedoCircleOutline />
        </Icon>
      </Link>
    </Condition>
  )
}
