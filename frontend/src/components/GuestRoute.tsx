/**
 * @fileoverview Гостевой роут — только для неавторизованных пользователей.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '#src/hooks/useAuth';

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Компонент-обёртка для роутов, доступных только гостям (неавторизованным).
 * Используется для страниц авторизации, лендинга и т.п.
 *
 * Поведение:
 * - Если идёт загрузка (проверка токенов) — показывает спиннер
 * - Если авторизован — редирект на главную (или на сохранённый путь)
 * - Если не авторизован — рендерит дочерний компонент
 *
 * @example
 * ```tsx
 * <Route
 *   path="/landing"
 *   element={
 *     <GuestRoute>
 *       <LandingPage />
 *     </GuestRoute>
 *   }
 * />
 * ```
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
