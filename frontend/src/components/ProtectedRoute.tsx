/**
 * @fileoverview Защищённый роут — только для авторизованных пользователей.
 */

import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isTMA } from '@telegram-apps/sdk-react';
import { useAuth } from '#src/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Компонент-обёртка для защиты роутов от неавторизованных пользователей.
 *
 * Поведение:
 * - Если идёт загрузка (проверка токенов) — показывает спиннер
 * - Если в Telegram Mini App и не авторизован — автоматический логин
 * - Если в браузере и не авторизован — редирект на /landing
 * - Если авторизован — рендерит дочерний компонент
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const location = useLocation();
  const autoLoginAttempted = useRef(false);
  const [ tmaLoginFailed, setTmaLoginFailed ] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && isTMA() && !autoLoginAttempted.current) {
      autoLoginAttempted.current = true;
      login().catch((error) => {
        console.error('Auto-login failed:', error);
        setTmaLoginFailed(true);
      });
    }
  }, [ isLoading, isAuthenticated, login ]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isTMA()) {
      if (tmaLoginFailed) {
        return (
          <div className="loading-screen">
            <p>Не удалось войти. Закройте Mini App и откройте снова из бота.</p>
          </div>
        );
      }
      return (
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      );
    }
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
