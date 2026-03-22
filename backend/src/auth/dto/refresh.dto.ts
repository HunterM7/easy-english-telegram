/**
 * @fileoverview DTO для обновления токенов.
 */

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для POST /v1/auth/refresh.
 * Обновляет access token по refresh token.
 */
export class RefreshDto {
  /**
   * UUID refresh token.
   * После использования старый токен удаляется, возвращается новая пара.
   */
  @IsString()
  @IsNotEmpty()
    refreshToken: string;
}
