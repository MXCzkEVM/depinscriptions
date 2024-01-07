import { ApiProperty } from '@nestjs/swagger'

export class Hexagon {
  @ApiProperty()
  hex: string

  @ApiProperty()
  tik: string

  @ApiProperty()
  mit: bigint
}
