import { atWillToUnit } from '@hairy/utils'
import { Condition } from '../utils'
import { countries } from '@/config'

export interface FlagProps {
  find?: string
  size?: string
  text?: boolean
}

export function Flag(props: FlagProps) {
  const country = props.find
    ? countries.find(c => c.code === props.find)
    : undefined

  const size = atWillToUnit(props.size || 24)

  if (!country?.image)
    return ''
  return (
    <div className="inline-flex items-center">
      <Condition is={props.text !== false}>
        <span className="min-w-8 mr-2">{country.code || props.find}</span>
      </Condition>
      <Condition is={country.image}>
        <img style={{ width: size }} src={country.image} />
      </Condition>
    </div>
  )
}
