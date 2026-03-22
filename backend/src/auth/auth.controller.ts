/**
 * @fileoverview Контроллер авторизации (Telegram Mini App).
 *
 * Эндпоинты:
 * - POST /v1/auth/login — вход по initData
 * - POST /v1/auth/refresh — обновление токенов
 *
 * Публичные (не требуют JWT).
 */

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService, AuthResponse, AuthTokens } from './auth.service';
import { LoginDto, RefreshDto } from './dto';
import { AuthTokensResponseDto, LoginResponseDto } from './dto/auth-responses.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход через Telegram Mini App (initData)' })
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'Токены и пользователь',
  })
  @ApiBadRequestResponse({ description: 'Невалидный initData' })
  @ApiUnauthorizedResponse({ description: 'Неверная подпись initData' })
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto.initData);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Новая пара токенов по refreshToken (ротация)' })
  @ApiOkResponse({
    type: AuthTokensResponseDto,
    description: 'Новые accessToken и refreshToken',
  })
  @ApiUnauthorizedResponse({ description: 'refreshToken истёк или невалиден' })
  async refresh(@Body() dto: RefreshDto): Promise<AuthTokens> {
    return this.authService.refresh(dto.refreshToken);
  }
}
