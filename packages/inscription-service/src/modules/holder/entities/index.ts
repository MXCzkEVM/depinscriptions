import { ApiProperty } from '@nestjs/swagger'

export class Holder {
  @ApiProperty()
  id: number

  @ApiProperty()
  tick: string

  @ApiProperty()
  number: bigint

  @ApiProperty()
  owner: string

  @ApiProperty()
  value: bigint
}
