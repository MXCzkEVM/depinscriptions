import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { Skeleton } from '@mui/material'
import { cellToLatLng } from 'h3-js'
import { Condition } from '../utils'
import { LocationDetail } from './LocationForHexagon.type'
import { proxyWithPersistant } from '@/utils'
import { useAsyncCallback } from '@/hooks'

const mappings = proxyWithPersistant<Record<string, string>>('__valtio_mappings', {})
const baseURL = 'https://nominatim.openstreetmap.org/reverse.php'

export interface LocationForHexProps {
  hexagon?: string
}

export function LocationForHexagon(props: LocationForHexProps) {
  const mappingsSnapshot = useSnapshot(mappings)

  const [loading, fetchLocation] = useAsyncCallback(async (hexagon: string) => {
    const [lat, lon] = cellToLatLng(hexagon)
    const params = { lat: String(lat), lon: String(lon), zoom: '18', format: 'jsonv2' }
    const suffix = `?${new URLSearchParams(Object.entries(params)).toString()}`
    try {
      const response = await fetch(`${baseURL}${suffix}`)
      const location = await response.json() as LocationDetail
      const addresses = [
        location.address.state || location.address.city,
        location.address.country,
      ]
      mappings[hexagon] = addresses.filter(Boolean).join(', ')
    }
    catch (error) {
      mappings[hexagon] = hexagon
    }
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
      is={name && !loading}
      if={(
        <div className="w-full truncate" onClick={event => event.stopPropagation()}>{name}</div>
      )}
      else={<Skeleton className="w-full" />}
    />
  )
}
