import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '#src/contexts/authContextValue';

/**
 * Доступ к контексту авторизации.
 *
 * @returns Контекст с `user`, `isAuthenticated`, `isLoading`, `login`
 * @throws Error если хук вызван вне `AuthProvider`
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, isLoading, login } = useAuth();
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
