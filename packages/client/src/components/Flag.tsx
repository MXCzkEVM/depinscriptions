import { atWillToUnit } from '@hairy/utils'
import { countries } from '@/config'

export interface FlagProps {
  find?: string
  size?: string
}

function Flag(props: FlagProps) {
  const find = props.find
    ? countries.find(c => c.code === props.find)
    : undefined
  const size = atWillToUnit(props.size || 24)

  if (!find?.image)
    return ''
  return (
    <img className="ml-2" style={{ width: size }} src={find.image} />
  )
}

export default Flag
