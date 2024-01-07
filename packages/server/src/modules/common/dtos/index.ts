import { ApiProperty } from '@nestjs/swagger'

export class PaginationResponse {
  @ApiProperty()
  total: number
}

export class ExistResponse {
  @ApiProperty()
  data: boolean
}
