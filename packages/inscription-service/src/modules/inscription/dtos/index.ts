import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { PaginationResponse } from '../../common'
import { Inscription } from '../entities'

export class InscriptionPageResponse extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(Inscription) },
  })
  data: Inscription[]
}

export class InscriptionResponse {
  @ApiProperty()
  hash: string

  @ApiProperty()
  creator: string

  @ApiProperty()
  owner: string

  @ApiProperty()
  from: string

  @ApiProperty()
  to: string

  @ApiProperty()
  number: number

  @ApiProperty()
  supply: number

  @ApiProperty()
  time: Date

  @ApiProperty()
  json: string

  @ApiProperty()
  tick: string

  @ApiProperty()
  holders: number
}
