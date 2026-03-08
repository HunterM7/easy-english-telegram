/**
 * @fileoverview Провайдер авторизации для React-приложения.
 *
 * Поддерживает два способа авторизации:
 * 1. Telegram Mini App — автоматическая авторизация через initData
 * 2. Браузер — авторизация через Telegram Login Widget
 *
 * При монтировании автоматически восстанавливает сессию из localStorage,
 * если есть сохранённый refresh token.
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { authService, type TelegramWidgetData, type User } from '#src/services/auth';
import { AuthContext, type AuthContextType } from './authContextValue';

export { AuthContext, type AuthContextType };

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Провайдер авторизации. Оборачивает приложение и предоставляет
 * контекст авторизации всем дочерним компонентам.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  /** Защита от двойного вызова в React StrictMode */
  const initCalledRef = useRef(false);

  /**
   * Вход через Telegram Mini App.
   * Получает initData из Telegram SDK и отправляет на сервер.
   * Используется только внутри Telegram клиента.
   */
  const login = useCallback(async () => {
    try {
      const launchParams = retrieveLaunchParams();
      const initData = launchParams.tgWebAppData?.toString();

      if (!initData) {
        console.error('No initData available');
        return;
      }

      const response = await authService.login(initData);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  /**
   * Вход через Telegram Login Widget.
   * Используется в браузерной версии приложения.
   * @param data - Данные от Telegram Login Widget (id, first_name, hash и т.д.)
   */
  const loginWithWidget = useCallback(async (data: TelegramWidgetData) => {
    try {
      const response = await authService.loginWithWidget(data);
      setUser(response.user);
    } catch (error) {
      console.error('Widget login failed:', error);
      throw error;
    }
  }, []);

  /**
   * Выход из аккаунта.
   * Инвалидирует refresh token на сервере и очищает локальное состояние.
   */
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  /**
   * Инициализация авторизации при монтировании.
   * Проверяет наличие сохранённых токенов и восстанавливает сессию.
   *
   * Логика:
   * 1. Проверяем наличие refresh token в localStorage
   * 2. Если есть — обновляем токены через /auth/refresh
   * 3. При успехе — восстанавливаем user из localStorage
   * 4. При ошибке — очищаем сессию
   *
   * Используется ref для защиты от двойного вызова в React StrictMode,
   * т.к. refresh token одноразовый и удаляется после использования.
   */
  useEffect(() => {
    if (initCalledRef.current) {
      return;
    }
    initCalledRef.current = true;

    async function initAuth() {
      setIsLoading(true);

      const hasStoredToken = authService.restoreSession();

      if (hasStoredToken) {
        const tokens = await authService.refresh();

        if (tokens) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }
        } else {
          setUser(null);
        }
      }

      setIsLoading(false);
    }

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithWidget,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

