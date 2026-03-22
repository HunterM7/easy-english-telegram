/**
 * @fileoverview DTO для входа через Telegram Mini App.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для POST /v1/auth/login.
 * Используется для авторизации из Telegram Mini App.
 */
export class LoginDto {
  /**
   * Строка initData от Telegram Web App.
   * Содержит данные пользователя и HMAC-SHA256 подпись.
   */
  @ApiProperty({
    example: 'user=%7B%22id%22%3A123456%7D&hash=abc123...',
    description: 'Строка initData от Telegram Web App',
  })
  @IsString()
  @IsNotEmpty()
  initData: string;
}
