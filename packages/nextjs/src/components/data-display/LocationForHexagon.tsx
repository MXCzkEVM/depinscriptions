import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { useAsyncFn } from 'react-use'
import { Skeleton } from '@mui/material'
import { cellToLatLng } from 'h3-js'
import { Condition } from '../utils'
import { LocationDetail } from './LocationForHexagon.type'
import { proxyWithPersistant } from '@/utils'

const mappings = proxyWithPersistant<Record<string, string>>('__valtio_mappings', {})
const baseURL = 'https://nominatim.openstreetmap.org/reverse.php'

export interface LocationForHexProps {
  hexagon?: string
}

export function LocationForHexagon(props: LocationForHexProps) {
  const mappingsSnapshot = useSnapshot(mappings)

  const [state, fetchLocation] = useAsyncFn(async (hexagon: string) => {
    const [lat, lon] = cellToLatLng(hexagon)
    const params = { lat: String(lat), lon: String(lon), zoom: '18', format: 'jsonv2' }
    const suffix = `?${new URLSearchParams(Object.entries(params)).toString()}`
    const response = await fetch(`${baseURL}${suffix}`)
    const location = await response.json() as LocationDetail
    mappings[hexagon] = `${location.address.state || location.address.city}, ${location.address.country}`
  })

  useEffect(() => {
    if (!props.hexagon)
      return
    if (!mappingsSnapshot[props.hexagon])
      fetchLocation(props.hexagon)
  }, [props.hexagon, mappingsSnapshot])

  if (!props.hexagon)
    return null

  const name = mappingsSnapshot[props.hexagon]

  return (
    <Condition
      is={name && !state.loading}
      if={(
        <div className="w-full truncate" onClick={event => event.stopPropagation()}>{name}</div>
      )}
      else={<Skeleton className="w-full" />}
    />
  )
}
