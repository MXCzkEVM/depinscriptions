import { ApiProperty } from '@nestjs/swagger'

export class Order {
  @ApiProperty()
  number: number

  @ApiProperty()
  hash: string

  @ApiProperty()
  tick: string

  @ApiProperty()
  maker: string

  @ApiProperty()
  amount: bigint

  @ApiProperty()
  price: string

  @ApiProperty()
  status: number

  @ApiProperty()
  time: string

  @ApiProperty()
  lastTime: string

  @ApiProperty()
  expiration: string

  @ApiProperty()
  buyer: string

  @ApiProperty()
  json: string
}
