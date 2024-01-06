import { ApiProperty } from '@nestjs/swagger'

export class Token {
  @ApiProperty()
  number: number

  @ApiProperty()
  tick: string

  @ApiProperty()
  minted: number

  @ApiProperty()
  total: number

  @ApiProperty()
  holders: number

  @ApiProperty()
  creator: string

  @ApiProperty()
  limit: number

  @ApiProperty()
  deployHash: string

  @ApiProperty()
  deployTime: Date

  @ApiProperty()
  lastTime: Date

  @ApiProperty()
  completedTime: Date | null

  @ApiProperty()
  trxs: number
}
