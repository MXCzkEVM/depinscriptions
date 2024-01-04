import { ApiProperty } from '@nestjs/swagger'

export class InscriptionDto {
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

export class HolderDto {
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

export class TickDto {
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
export class HexagonDto {
  @ApiProperty()
  hex: string

  @ApiProperty()
  tik: string

  @ApiProperty()
  mit: bigint
}

export class OrderDto {
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
}
