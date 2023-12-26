import { countries } from '@/config'

export interface CountryFlagProps {
  find?: string
  code?: string
  image?: string
}

function CountryFlag(props: CountryFlagProps) {
  const find = props.find
    ? countries.find(c => c.code === props.find)
    : undefined
  const country = {
    code: find?.code || props.code,
    image: find?.image || props.image,
  }
  if (!country.code)
    return ''
  return (
    <div className="flex items-center">
      <span className="min-w-10">{country.code || props.find}</span>
      {country.image && <img className="w-6 ml-2" src={country.image} />}
    </div>
  )
}

export default CountryFlag
