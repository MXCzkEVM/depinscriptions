import { Link, TypographyOwnProps } from '@mui/material'
import { Copy } from '@ricons/ionicons5'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Icon from './Icon'
import { cover } from '@/utils'

const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER!

interface ChainLinkProps extends TypographyOwnProps {
  type: 'hash' | 'address'
  href?: string
}

function ChainLink(props: ChainLinkProps) {
  const { t } = useTranslation()
  const [_, copyToClipboard] = useCopyToClipboard()

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
    <div className="flex items-center w-full">
      <Link className="truncate" color="inherit" {...props} href={href}>
        {props.children || cover(props.href, [6, 3, 4])}
      </Link>
      <Icon className="ml-2 mt-[1px] cursor-pointer" size="16px" onClick={onCopy}>
        <Copy />
      </Icon>
    </div>
  )
}

export default ChainLink
