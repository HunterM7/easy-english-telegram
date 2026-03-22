/**
 * @fileoverview DTO для обновления токенов.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для POST /v1/auth/refresh.
 * Обновляет accessToken по refreshToken.
 */
export class RefreshDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Opaque refreshToken из прошлого login/refresh',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
