/**
 * @fileoverview Компонент Telegram Login (новая библиотека).
 *
 * Использует официальный скрипт: https://oauth.telegram.org/js/telegram-login.js
 * Документация: https://core.telegram.org/bots/telegram-login#using-the-telegram-login-library
 *
 * Callback возвращает { id_token, user } или { error }.
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface TelegramAuthUser {
  id: number;
  name?: string;
  preferred_username?: string;
  picture?: string;
}

interface TelegramAuthResult {
  id_token?: string;
  user?: TelegramAuthUser;
  error?: string;
}

interface TelegramLoginWidgetProps {
  clientId: string;
  /** Колбэк с id_token для отправки на бэкенд */
  onAuth: (idToken: string) => void;
  onError?: (error: string) => void;
  buttonSize?: 'large' | 'medium' | 'small';
}

const SCRIPT_ID = 'telegram-login-script';
const SCRIPT_URL = 'https://oauth.telegram.org/js/telegram-login.js?3';

export function TelegramLoginWidget({
  clientId,
  onAuth,
  onError,
  buttonSize = 'large',
}: TelegramLoginWidgetProps) {
  const [isReady, setIsReady] = useState(false);
  const onAuthRef = useRef(onAuth);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onAuthRef.current = onAuth;
    onErrorRef.current = onError;
  }, [onAuth, onError]);

  const handleResult = useCallback((result: TelegramAuthResult) => {
    console.log('Telegram auth result:', result);
    if (result.error) {
      console.error('Telegram auth error:', result.error);
      onErrorRef.current?.(result.error);
      return;
    }
    if (result.id_token) {
      onAuthRef.current(result.id_token);
    }
  }, []);

  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) {
      if (window.Telegram?.Login) {
        setIsReady(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      console.log('Telegram Login script loaded');
      setTimeout(() => {
        setIsReady(!!window.Telegram?.Login);
      }, 100);
    };

    script.onerror = () => {
      console.error('Failed to load Telegram Login script');
    };

    document.head.appendChild(script);
  }, []);

  const handleClick = useCallback(() => {
    const numericClientId = Number(clientId);

    if (!numericClientId || isNaN(numericClientId)) {
      onErrorRef.current?.('Invalid client_id');
      return;
    }

    if (window.Telegram?.Login) {
      window.Telegram.Login.auth(
        {
          client_id: numericClientId,
          request_access: ['write'],
          lang: 'ru',
        },
        handleResult
      );
    } else {
      onErrorRef.current?.('Telegram Login SDK not loaded');
    }
  }, [clientId, handleResult]);

  const padding = buttonSize === 'large' ? '12px 24px' : buttonSize === 'medium' ? '10px 20px' : '8px 16px';
  const fontSize = buttonSize === 'large' ? '16px' : buttonSize === 'medium' ? '14px' : '12px';

  return (
    <button
      onClick={handleClick}
      disabled={!isReady}
      style={{
        background: isReady
          ? 'linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)'
          : '#ccc',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: isReady ? 'pointer' : 'not-allowed',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding,
        fontSize,
        opacity: isReady ? 1 : 0.7,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.99-3.45 3.8-1.6 4.59-1.88 5.1-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.01.07.01.17 0 .27z"
          fill="white"
        />
      </svg>
      {isReady ? 'Войти через Telegram' : 'Загрузка...'}
    </button>
  );
}
