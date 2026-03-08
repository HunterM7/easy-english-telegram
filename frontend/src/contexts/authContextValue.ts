/**
 * @fileoverview Определение типов и контекста авторизации.
 * Вынесено в отдельный файл для совместимости с React Fast Refresh.
 */

import { createContext } from 'react';
import type { User, TelegramWidgetData } from '#src/services/auth';

/**
 * Тип контекста авторизации.
 * Предоставляет состояние и методы для управления аутентификацией.
 */
export interface AuthContextType {
  /** Текущий авторизованный пользователь или null */
  user: User | null;
  /** Флаг авторизации (true если user !== null) */
  isAuthenticated: boolean;
  /** Флаг загрузки (true во время инициализации/проверки токенов) */
  isLoading: boolean;
  /** Вход через Telegram Mini App (использует initData) */
  login: () => Promise<void>;
  /** Вход через Telegram Login Widget (браузерная версия) */
  loginWithWidget: (data: TelegramWidgetData) => Promise<void>;
  /** Выход из аккаунта */
  logout: () => Promise<void>;
}

/**
 * React Context для авторизации.
 * Используется в связке с AuthProvider и хуком useAuth.
 */
export const AuthContext = createContext<AuthContextType | null>(null);
