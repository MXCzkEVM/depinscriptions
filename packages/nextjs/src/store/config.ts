import { proxyWithPersistant } from '@/utils'

export const config = proxyWithPersistant('store_config', {
  price: '0.00',
})
