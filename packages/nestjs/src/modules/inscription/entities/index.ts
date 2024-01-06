import { ApiProperty } from '@nestjs/swagger'

export class Inscription {
  @ApiProperty()
  number: number

  @ApiProperty()
  hash: string

  @ApiProperty()
  op: string

  @ApiProperty()
  tick: string

  @ApiProperty()
  json: string

  @ApiProperty()
  from: string

  @ApiProperty()
  to: string

  @ApiProperty()
  time: Date
}
