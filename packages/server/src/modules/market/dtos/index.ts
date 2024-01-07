import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { PaginationResponse } from '../../common'
import { MarketRaw } from '../entities'

export class MarketPageResponse extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(MarketRaw) },
  })
  data: MarketRaw[]

  @ApiProperty()
  price: string
}
