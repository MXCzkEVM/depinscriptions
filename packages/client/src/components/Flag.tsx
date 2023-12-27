import { countries } from '@/config'

export interface FlagProps {
  find?: string
}

function Flag(props: FlagProps) {
  const find = props.find
    ? countries.find(c => c.code === props.find)
    : undefined

  if (!find?.image)
    return ''
  return (
    <img className="w-6 ml-2" src={find.image} />
  )
}

export default Flag
