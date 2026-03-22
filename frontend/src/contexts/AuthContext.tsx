/**
 * @fileoverview Провайдер авторизации для React-приложения (Telegram Mini App).
 *
 * Поддерживается вход по `initData` и восстановление сессии через `refresh` при наличии
 * refresh token в localStorage.
 *
 * При монтировании автоматически восстанавливает сессию, если есть сохранённый refresh token.
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { retrieveRawInitData } from '@telegram-apps/sdk-react';
import { authService, type User } from '#src/services/auth';
import { AuthContext, type AuthContextType } from './authContextValue';

export { AuthContext, type AuthContextType };

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Провайдер авторизации. Оборачивает приложение и предоставляет контекст авторизации дочерним компонентам.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [ user, setUser ] = useState<User | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);
  /** Защита от двойного вызова в React StrictMode */
  const initCalledRef = useRef(false);

  /**
   * Вход через Telegram Mini App: получает initData из SDK и отправляет на сервер.
   * Используется только внутри Telegram-клиента.
   */
  const login = useCallback(async () => {
    try {
      const initData = retrieveRawInitData();

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
   * Инициализация при монтировании: при наличии refresh token — обновление пары токенов;
   * при успехе — восстановление `user` из localStorage.
   *
   * Используется ref, чтобы не вызвать `refresh` дважды в StrictMode (refresh token одноразовый).
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
