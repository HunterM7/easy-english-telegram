/**
 * @fileoverview DTO для выхода из приложения.
 */

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для POST /v1/auth/logout.
 * Инвалидирует refresh token на сервере.
 */
export class LogoutDto {
  /** UUID refresh token для инвалидации */
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
