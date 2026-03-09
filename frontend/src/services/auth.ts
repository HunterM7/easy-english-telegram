/**
 * @fileoverview Сервис авторизации для фронтенда.
 *
 * Отвечает за:
 * - Взаимодействие с API авторизации
 * - Хранение токенов и данных пользователя в localStorage
 * - Управление жизненным циклом сессии
 *
 * Токены:
 * - Access token (JWT, 30 мин) — для авторизации запросов
 * - Refresh token (UUID, 30 дней) — для обновления access token
 */

import { apiClient } from './api';

/** Данные авторизованного пользователя */
export interface User {
  /** UUID пользователя в базе */
  id: string;
  /** Telegram ID пользователя */
  telegramId: string;
  /** Имя из Telegram */
  firstName: string | null;
  /** Фамилия из Telegram */
  lastName: string | null;
  /** Username в Telegram (без @) */
  username: string | null;
  /** URL аватара из Telegram */
  photoUrl: string | null;
}

/** Пара токенов авторизации */
export interface AuthTokens {
  /** JWT access token для авторизации запросов */
  accessToken: string;
  /** UUID refresh token для обновления access token */
  refreshToken: string;
  /** Время жизни access token в секундах */
  expiresIn: number;
}

/** Ответ сервера при успешной авторизации */
export interface LoginResponse extends AuthTokens {
  /** Данные авторизованного пользователя */
  user: User;
}

/**
 * Данные от Telegram Login Widget.
 * Передаются в колбэк после успешной авторизации через виджет.
 * @see https://core.telegram.org/widgets/login
 */
export interface TelegramWidgetData {
  /** Telegram ID пользователя */
  id: number;
  /** Имя пользователя */
  first_name?: string;
  /** Фамилия пользователя */
  last_name?: string;
  /** Username (без @) */
  username?: string;
  /** URL аватара */
  photo_url?: string;
  /** Unix timestamp авторизации */
  auth_date: number;
  /** HMAC-SHA256 подпись для валидации на сервере */
  hash: string;
}

/** Ключи для хранения данных в localStorage */
const REFRESH_TOKEN_KEY = 'easy_english_refresh_token';
const ACCESS_TOKEN_KEY = 'easy_english_access_token';
const USER_KEY = 'easy_english_user';

/**
 * Сервис авторизации.
 * Управляет аутентификацией пользователя и хранением сессии.
 */
class AuthService {
  /**
   * Вход через Telegram Mini App.
   * Отправляет initData на сервер для валидации и создания сессии.
   *
   * @param initData - Строка initData от Telegram Web App
   * @returns Токены и данные пользователя
   * @throws При ошибке валидации или сетевой ошибке
   */
  async login(initData: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('auth/login', {
      initData,
    });

    this.saveTokens(response.accessToken, response.refreshToken);
    this.saveUser(response.user);
    apiClient.setAccessToken(response.accessToken);

    return response;
  }

  /**
   * Вход через Telegram Login Widget (legacy).
   * Отправляет данные виджета на сервер для валидации.
   *
   * @param data - Данные от Telegram Login Widget
   * @returns Токены и данные пользователя
   * @throws При ошибке валидации или сетевой ошибке
   */
  async loginWithWidget(data: TelegramWidgetData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      'auth/telegram-widget',
      data,
    );

    this.saveTokens(response.accessToken, response.refreshToken);
    this.saveUser(response.user);
    apiClient.setAccessToken(response.accessToken);

    return response;
  }

  /**
   * Вход через новый Telegram Login (OIDC).
   * Отправляет id_token на сервер для валидации.
   *
   * @param idToken - JWT токен от Telegram OIDC
   * @returns Токены и данные пользователя
   * @throws При ошибке валидации или сетевой ошибке
   */
  async loginWithIdToken(idToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      'auth/telegram-oidc',
      { idToken },
    );

    this.saveTokens(response.accessToken, response.refreshToken);
    this.saveUser(response.user);
    apiClient.setAccessToken(response.accessToken);

    return response;
  }

  /**
   * Обновление токенов по refresh token.
   * Старый refresh token удаляется, возвращается новая пара токенов.
   *
   * @returns Новая пара токенов или null при ошибке
   */
  async refresh(): Promise<AuthTokens | null> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await apiClient.post<AuthTokens>('auth/refresh', {
        refreshToken,
      });

      this.saveTokens(response.accessToken, response.refreshToken);
      apiClient.setAccessToken(response.accessToken);

      return response;
    } catch {
      this.clearSession();
      return null;
    }
  }

  /**
   * Выход из аккаунта.
   * Инвалидирует refresh token на сервере и очищает локальные данные.
   */
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      try {
        await apiClient.post('auth/logout', { refreshToken });
      } catch {
        // Игнорируем ошибки — локальная очистка важнее
      }
    }

    this.clearSession();
    apiClient.setAccessToken(null);
  }

  /**
   * Сохраняет токены в localStorage.
   */
  private saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Сохраняет данные пользователя в localStorage.
   */
  private saveUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Очищает все данные сессии из localStorage.
   */
  private clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Получает сохранённые данные пользователя из localStorage.
   * @returns Данные пользователя или null
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  /**
   * Получает refresh token из localStorage.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Получает access token из localStorage.
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Восстанавливает сессию из localStorage.
   * Устанавливает access token в API клиент если он есть.
   *
   * @returns true если есть сохранённый refresh token (сессия может быть восстановлена)
   */
  restoreSession(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (accessToken) {
      apiClient.setAccessToken(accessToken);
    }

    return !!refreshToken;
  }
}

/** Синглтон сервиса авторизации */
export const authService = new AuthService();
