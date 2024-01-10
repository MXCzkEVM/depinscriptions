import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { PaginationResponse } from '../../common'
import { Token } from '../entities'

export class TokenPageResponse extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(Token) },
  })
  data: Token[]
}

export class TokenDeployedResponse {
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
  })
  data: string[]
}
