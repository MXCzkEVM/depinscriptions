import { Link, TypographyOwnProps } from '@mui/material'
import { Copy } from '@ricons/ionicons5'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useEnsName } from 'wagmi'
import { Icon } from './Icon'
import { cover } from '@/utils'

const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER!

export interface ChainLinkProps extends TypographyOwnProps {
  type: 'hash' | 'address'
  href?: string
}

export function ChainLink(props: ChainLinkProps) {
  const { t } = useTranslation()
  const [_, copyToClipboard] = useCopyToClipboard()
  const { data } = useEnsName({
    address: '0x0795D90c6d60F7c77041862E9aE5059B4d5e0d7A',
  })

  const href = props.type === 'hash'
    ? `${EXPLORER_URL}/tx/${props.href}`
    : `/tokens/query?address=${props.href}`

  function onCopy() {
    if (!props.href)
      return
    copyToClipboard(props.href)
    toast.success(t('Copy Success'), { position: 'top-center' })
  }
  return (
    <div className="flex items-center w-full text-xs sm:text-base">
      <Link className="truncate" color="inherit" {...props} href={href}>
        {props.children || (
          props.type === 'address'
            ? data || cover(props.href, [4, 3, 4])
            : cover(props.href, [4, 3, 4])
        )}
      </Link>
      <Icon className="ml-2 mt-[1px] cursor-pointer text-xs" onClick={onCopy}>
        <Copy />
      </Icon>
    </div>
  )
}
