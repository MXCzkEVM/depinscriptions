import { ApiProperty } from '@nestjs/swagger'

export class MarketRaw {
  @ApiProperty()
  tick: string

  @ApiProperty()
  price: string

  @ApiProperty()
  volume: string

  @ApiProperty()
  sales: string

  @ApiProperty()
  holders: string

  @ApiProperty()
  totalVolume: string

  @ApiProperty()
  totalSales: string

  @ApiProperty()
  marketCap: string

  @ApiProperty()
  listed: string
}

export class MarketDetail {
  @ApiProperty()
  tick: string

  @ApiProperty()
  price: string

  @ApiProperty()
  volume: string

  @ApiProperty()
  sales: string

  @ApiProperty()
  holders: string

  @ApiProperty()
  limit: string

  @ApiProperty()
  limitPrice: string
}
