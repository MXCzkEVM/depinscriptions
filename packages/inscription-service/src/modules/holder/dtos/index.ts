import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { PaginationResponse } from '../../common'
import { Holder } from '../entities'

export class HolderPageResponseDto extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(Holder) },
  })
  data: Holder[]
}
