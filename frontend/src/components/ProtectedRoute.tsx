/**
 * @fileoverview Защищённый роут — только для авторизованных пользователей.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '#src/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Компонент-обёртка для защиты роутов от неавторизованных пользователей.
 *
 * Поведение:
 * - Если идёт загрузка (проверка токенов) — показывает спиннер
 * - Если не авторизован — редирект на /landing с сохранением исходного пути
 * - Если авторизован — рендерит дочерний компонент
 *
 * @example
 * ```tsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
