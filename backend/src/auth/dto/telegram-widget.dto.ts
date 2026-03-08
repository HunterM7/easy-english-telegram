/**
 * @fileoverview DTO для входа через Telegram Login Widget.
 * @see https://core.telegram.org/widgets/login
 */

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO для POST /v1/auth/telegram-widget.
 * Данные приходят от Telegram Login Widget после успешной авторизации.
 */
export class TelegramWidgetDto {
  /** Telegram ID пользователя */
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  /** Имя пользователя в Telegram */
  @IsString()
  @IsOptional()
  first_name?: string;

  /** Фамилия пользователя в Telegram */
  @IsString()
  @IsOptional()
  last_name?: string;

  /** Username в Telegram (без @) */
  @IsString()
  @IsOptional()
  username?: string;

  /** URL аватара пользователя */
  @IsString()
  @IsOptional()
  photo_url?: string;

  /** Unix timestamp момента авторизации */
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  auth_date: number;

  /**
   * HMAC-SHA256 подпись для валидации данных.
   * Вычисляется как HMAC(SHA256(bot_token), data_check_string).
   */
  @IsString()
  @IsNotEmpty()
  hash: string;
}
