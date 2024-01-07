import { createContext } from 'react'

const MarketContext = createContext({
  mode: 'mint' as 'mint' | 'unit',
  limit: '0',
})

export default MarketContext
