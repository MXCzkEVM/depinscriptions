import { ApiProperty } from '@nestjs/swagger'

export class RecoveryBody {
  @ApiProperty()
  password: string

  @ApiProperty()
  value: string
}
