/**
 * @fileoverview Сервис авторизации через Telegram.
 *
 * Поддерживает два способа авторизации:
 * 1. Telegram Mini App (initData) — для приложений внутри Telegram
 * 2. Telegram Login Widget — для браузерной версии
 *
 * Безопасность:
 * - Валидация HMAC-SHA256 подписи от Telegram
 * - Проверка времени авторизации (не старше 24 часов)
 * - В dev-режиме проверка подписи пропускается
 *
 * Токены:
 * - Access token (JWT, 30 мин) — для авторизации запросов
 * - Refresh token (UUID, 30 дней) — хранится в БД, одноразовый
 */

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { createHash, createHmac } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { TelegramWidgetDto } from './dto';

/**
 * Данные пользователя из Telegram initData.
 * Структура соответствует Telegram Web App API.
 */
interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

/** Пара токенов авторизации */
export interface AuthTokens {
  /** JWT access token */
  accessToken: string;
  /** UUID refresh token (одноразовый) */
  refreshToken: string;
  /** Время жизни access token в секундах */
  expiresIn: number;
}

/** Полный ответ авторизации с данными пользователя */
export interface AuthResponse extends AuthTokens {
  user: {
    id: string;
    telegramId: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    photoUrl: string | null;
  };
}

@Injectable()
export class AuthService {
  private readonly accessTokenExpiry = 30 * 60; // 30 минут в секундах
  private readonly refreshTokenExpiryDays = 30; // 30 дней

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Вход через Telegram. Валидирует initData, создаёт/находит пользователя, возвращает токены.
   */
  async login(initData: string): Promise<AuthResponse> {
    const telegramUser = this.validateInitData(initData);

    const user = await this.prisma.user.upsert({
      where: { telegramId: String(telegramUser.id) },
      update: {
        firstName: telegramUser.first_name || null,
        lastName: telegramUser.last_name || null,
        username: telegramUser.username || null,
        photoUrl: telegramUser.photo_url || null,
      },
      create: {
        telegramId: String(telegramUser.id),
        firstName: telegramUser.first_name || null,
        lastName: telegramUser.last_name || null,
        username: telegramUser.username || null,
        photoUrl: telegramUser.photo_url || null,
      },
    });

    const tokens = await this.generateTokens(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        photoUrl: user.photoUrl,
      },
    };
  }

  /**
   * Обновление access токена по refresh токену.
   */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    return this.generateTokens(storedToken.userId);
  }

  /**
   * Выход из приложения. Инвалидирует refresh токен.
   */
  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  /**
   * Вход через Telegram Login Widget (для браузерной версии).
   */
  async loginWithWidget(data: TelegramWidgetDto): Promise<AuthResponse> {
    this.validateWidgetData(data);

    const user = await this.prisma.user.upsert({
      where: { telegramId: String(data.id) },
      update: {
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        username: data.username || null,
        photoUrl: data.photo_url || null,
      },
      create: {
        telegramId: String(data.id),
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        username: data.username || null,
        photoUrl: data.photo_url || null,
      },
    });

    const tokens = await this.generateTokens(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        photoUrl: user.photoUrl,
      },
    };
  }

  /**
   * Валидация данных от Telegram Login Widget.
   * Алгоритм отличается от initData — используется SHA256(bot_token) как секрет.
   */
  private validateWidgetData(data: TelegramWidgetDto): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    // В dev-режиме пропускаем проверку
    if (!isProduction) {
      return;
    }

    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new BadRequestException('Telegram bot token not configured');
    }

    // Проверка времени авторизации (не старше 24 часов)
    const authTimestamp = data.auth_date * 1000;
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000;

    if (now - authTimestamp > maxAge) {
      throw new UnauthorizedException('Widget auth data expired');
    }

    // Формируем строку для проверки (все поля кроме hash, отсортированы по алфавиту)
    const checkArr: string[] = [];
    if (data.auth_date) checkArr.push(`auth_date=${data.auth_date}`);
    if (data.first_name) checkArr.push(`first_name=${data.first_name}`);
    if (data.id) checkArr.push(`id=${data.id}`);
    if (data.last_name) checkArr.push(`last_name=${data.last_name}`);
    if (data.photo_url) checkArr.push(`photo_url=${data.photo_url}`);
    if (data.username) checkArr.push(`username=${data.username}`);

    const dataCheckString = checkArr.sort().join('\n');

    // Секретный ключ = SHA256(bot_token)
    const secretKey = createHash('sha256').update(botToken).digest();

    const calculatedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== data.hash) {
      throw new UnauthorizedException('Invalid widget signature');
    }
  }

  /**
   * Валидация initData от Telegram Web App.
   * Проверяет hash с использованием секрета бота.
   * В dev-режиме (NODE_ENV !== 'production') пропускает проверку hash.
   */
  private validateInitData(initData: string): TelegramUser {
    const params = new URLSearchParams(initData);
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    const userStr = params.get('user');
    if (!userStr) {
      throw new BadRequestException('Invalid initData: missing user');
    }

    let telegramUser: TelegramUser;
    try {
      telegramUser = JSON.parse(userStr) as TelegramUser;
    } catch {
      throw new BadRequestException('Invalid initData: invalid user JSON');
    }

    // В dev-режиме пропускаем проверку hash
    if (!isProduction) {
      return telegramUser;
    }

    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new BadRequestException('Telegram bot token not configured');
    }

    const hash = params.get('hash');
    if (!hash) {
      throw new BadRequestException('Invalid initData: missing hash');
    }

    params.delete('hash');
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    const calculatedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid initData signature');
    }

    const authDate = params.get('auth_date');
    if (authDate) {
      const authTimestamp = parseInt(authDate, 10) * 1000;
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 часа

      if (now - authTimestamp > maxAge) {
        throw new UnauthorizedException('initData expired');
      }
    }

    return telegramUser;
  }

  /**
   * Генерация пары access + refresh токенов.
   */
  private async generateTokens(userId: string): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: this.accessTokenExpiry },
    );

    const refreshTokenValue = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.refreshTokenExpiryDays);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: this.accessTokenExpiry,
    };
  }
}
