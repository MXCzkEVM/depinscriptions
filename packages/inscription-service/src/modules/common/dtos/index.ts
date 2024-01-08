import { ApiProperty } from '@nestjs/swagger'

export class PaginationResponse {
  @ApiProperty()
  total: number
}

export class ExistResponse {
  @ApiProperty()
  data: boolean
}

export class AuthorizationBody {
  @ApiProperty()
  password: string

  @ApiProperty()
  value: string
}
