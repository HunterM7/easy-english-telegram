/**
 * @fileoverview Хук для доступа к контексту авторизации.
 */

import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '#src/contexts/authContextValue';

/**
 * Хук для доступа к состоянию и методам авторизации.
 *
 * @returns Контекст авторизации с user, isAuthenticated, login, logout и т.д.
 * @throws Error если используется вне AuthProvider
 *
 * @example
 * ```tsx
 * function Profile() {
 *   const { user, logout, isAuthenticated } = useAuth();
 *
 *   if (!isAuthenticated) return <Login />;
 *
 *   return (
 *     <div>
 *       <p>Привет, {user.firstName}!</p>
 *       <button onClick={logout}>Выйти</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

