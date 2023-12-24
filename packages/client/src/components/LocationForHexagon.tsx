import { useEffect } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { LocationDetail } from './LocationForHexagon.type'
import Condition from './Condition'
import { useAsyncFn } from 'react-use'
import { Skeleton } from '@mui/material'
import { cellToLatLng } from 'h3-js'

const mappings = proxy<Record<string, string>>({})
const baseURL = "https://nominatim.openstreetmap.org/reverse.php"

export interface LocationForHexProps {
  hexagon?: string
}

function LocationForHexagon(props: LocationForHexProps) {
  const mappingsSnapshot = useSnapshot(mappings)

  const [state, fetchLocation] = useAsyncFn(async (hexagon: string) => {
    const [lat, lon] = cellToLatLng(hexagon)
    const params = { lat: String(lat), lon: String(lon), zoom: '18', format: 'jsonv2' }
    const suffix = `?${new URLSearchParams(Object.entries(params)).toString()}`;
    const response = await fetch(`${baseURL}${suffix}`)
    const location = await response.json() as LocationDetail
    mappings[hexagon] = location.name
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

  return <Condition
    is={!props.hexagon && !name && !state.loading}
    if={name}
    else={<Skeleton className='w-full' />}
  />
}


export default LocationForHexagon