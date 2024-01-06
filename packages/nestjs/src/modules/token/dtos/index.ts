import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { PaginationResponse } from '../../common'
import { Tick } from '../entities'

export class TickPageResponse extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(Tick) },
  })
  data: Tick[]
}

export class TickDeployedResponse {
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
  })
  data: string[]
}
