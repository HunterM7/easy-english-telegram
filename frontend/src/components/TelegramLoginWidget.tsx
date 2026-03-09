/**
 * @fileoverview Компонент Telegram Login Widget (новая версия).
 *
 * Использует новую Telegram Login library с поддержкой OIDC.
 * Документация: https://core.telegram.org/bots/telegram-login
 *
 * Требования:
 * - Добавить Allowed URLs в BotFather Mini App → Bot Settings → Web Login
 */

import { useEffect, useRef, useCallback } from 'react';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramAuthResult {
  id_token?: string;
  user?: TelegramUser;
  error?: string;
}

interface TelegramLoginWidgetProps {
  /** Client ID (Bot ID) из BotFather */
  clientId: string;
  /** Колбэк после успешной авторизации */
  onAuth: (user: TelegramUser, idToken: string) => void;
  /** Колбэк при ошибке */
  onError?: (error: string) => void;
  /** Размер кнопки */
  buttonSize?: 'large' | 'medium' | 'small';
}

declare global {
  interface Window {
    Telegram?: {
      Login: {
        init: (options: { client_id: number; request_access?: string[]; lang?: string }, callback: (result: TelegramAuthResult) => void) => void;
        open: (callback?: (result: TelegramAuthResult) => void) => void;
        auth: (options: { client_id: number; request_access?: string[]; lang?: string }, callback: (result: TelegramAuthResult) => void) => void;
      };
    };
  }
}

export function TelegramLoginWidget({
  clientId,
  onAuth,
  onError,
  buttonSize = 'large',
}: TelegramLoginWidgetProps) {
  const scriptLoaded = useRef(false);
  const onAuthRef = useRef(onAuth);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onAuthRef.current = onAuth;
    onErrorRef.current = onError;
  }, [onAuth, onError]);

  const handleAuth = useCallback((result: TelegramAuthResult) => {
    console.log('Telegram auth result:', result);
    if (result.error) {
      console.error('Telegram auth error:', result.error);
      onErrorRef.current?.(result.error);
      return;
    }
    if (result.user && result.id_token) {
      onAuthRef.current(result.user, result.id_token);
    }
  }, []);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
      if (window.Telegram?.Login) {
        window.Telegram.Login.init(
          {
            client_id: Number(clientId),
            request_access: ['write'],
            lang: 'ru',
          },
          handleAuth
        );
      }
    };
    document.head.appendChild(script);

    return () => {
      // Не удаляем скрипт при размонтировании
    };
  }, [clientId, handleAuth]);

  const handleClick = () => {
    if (window.Telegram?.Login) {
      window.Telegram.Login.open(handleAuth);
    } else {
      console.error('Telegram Login SDK not loaded');
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: 'linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: buttonSize === 'large' ? '12px 24px' : buttonSize === 'medium' ? '10px 20px' : '8px 16px',
        fontSize: buttonSize === 'large' ? '16px' : buttonSize === 'medium' ? '14px' : '12px',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.8-1.6 4.59-1.88 5.1-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.01.07.01.17 0 .27z"
          fill="white"
        />
      </svg>
      Войти через Telegram
    </button>
  );
}
