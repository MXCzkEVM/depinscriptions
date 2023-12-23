import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Holder, Inscription, Tick } from "@prisma/client";
import { HolderDto, InscriptionDto, TickDto } from "./source";


export class PaginationResponseDto {
  @ApiProperty()
  total: number
}

export class InscriptionPageResponseDto extends PaginationResponseDto {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(InscriptionDto) }
  })
  data: Inscription[]
}

export class TickPageResponseDto extends PaginationResponseDto {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(TickDto) }
  })
  data: Tick[]
}

export class InscriptionResponseDto {
  @ApiProperty()
  hash: string

  @ApiProperty()
  creator: string

  @ApiProperty()
  owner: string

  @ApiProperty()
  from: string

  @ApiProperty()
  to: string

  @ApiProperty()
  number: number

  @ApiProperty()
  supply: number

  @ApiProperty()
  time: Date

  @ApiProperty()
  json: string

  @ApiProperty()
  tick: string
}

export class HoldersResponseDto {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(HolderDto) }
  })
  data: Holder[]
}
