/**
 * @fileoverview Контроллер авторизации.
 *
 * Эндпоинты:
 * - POST /v1/auth/login — вход через Telegram Mini App (initData)
 * - POST /v1/auth/telegram-widget — вход через Telegram Login Widget
 * - POST /v1/auth/refresh — обновление токенов
 * - POST /v1/auth/logout — выход (инвалидация refresh token)
 *
 * Все эндпоинты публичные (не требуют JWT).
 */

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService, AuthResponse, AuthTokens } from './auth.service';
import { LoginDto, RefreshDto, LogoutDto, TelegramWidgetDto, TelegramOidcDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /v1/auth/login
   * Вход через Telegram. Принимает initData, возвращает access + refresh токены.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto.initData);
  }

  /**
   * POST /v1/auth/refresh
   * Обновление access токена по refresh токену.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto): Promise<AuthTokens> {
    return this.authService.refresh(dto.refreshToken);
  }

  /**
   * POST /v1/auth/logout
   * Выход из приложения. Инвалидирует refresh токен.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: LogoutDto) {
    await this.authService.logout(dto.refreshToken);
    return {};
  }

  /**
   * POST /v1/auth/telegram-widget
   * Вход через Telegram Login Widget (legacy, для браузерной версии).
   */
  @Post('telegram-widget')
  @HttpCode(HttpStatus.OK)
  async loginWithWidget(@Body() dto: TelegramWidgetDto): Promise<AuthResponse> {
    return this.authService.loginWithWidget(dto);
  }

  /**
   * POST /v1/auth/telegram-oidc
   * Вход через новый Telegram Login (OIDC, id_token).
   */
  @Post('telegram-oidc')
  @HttpCode(HttpStatus.OK)
  async loginWithOidc(@Body() dto: TelegramOidcDto): Promise<AuthResponse> {
    return this.authService.loginWithOidc(dto.idToken);
  }
}
