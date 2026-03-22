import { createContext } from 'react';
import type { User } from '#src/services/auth';

/**
 * Контекст авторизации (Telegram Mini App: `initData` + обновление по refresh).
 *
 * Используется вместе с `AuthProvider` и хуком `useAuth`.
 */
export interface AuthContextType {
  /** Текущий пользователь или null до входа / после сброса сессии */
  user: User | null;
  isAuthenticated: boolean;
  /** Завершение начальной проверки токенов и при необходимости refresh */
  isLoading: boolean;
  /** Вход по initData из Telegram SDK (только внутри Mini App) */
  login: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
