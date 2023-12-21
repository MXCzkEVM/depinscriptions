import { atWillToUnit } from '@hairy/utils'
export interface IconProps {
  size?: string | number
  color?: string
  tag?: keyof JSX.IntrinsicElements
  children?: React.ReactNode
}

function Icon(props: IconProps) {
  const MergedTag = props.tag ?? 'span'
  return <MergedTag
    style={{
      color: props.color,
      fontSize: atWillToUnit(props.size || 24)
    }}
    className="icon w-[1em] h-[1em] inline-flex"
  >
    {props.children}
  </MergedTag>
}

export default Icon