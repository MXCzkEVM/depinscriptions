import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { PaginationResponse } from '../../common'
import { Hexagon } from '../entities'

export class HexagonPageResponse extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(Hexagon) },
  })
  data: Hexagon[]
}
