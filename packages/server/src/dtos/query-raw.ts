import { ApiProperty } from '@nestjs/swagger'

export class MarketRawDto {
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

export class MarketDetailDto {
  @ApiProperty()
  tick: string

  @ApiProperty()
  holders: string

  @ApiProperty()
  price: string

  @ApiProperty()
  volume: string

  @ApiProperty()
  sales: string

  @ApiProperty()
  limit: string

  @ApiProperty()
  limitPrice: string
}
