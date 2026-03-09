/**
 * @fileoverview Компонент Telegram Login по официальной документации.
 *
 * Скрипт загружается в index.html. Используем Telegram.Login.init() и
 * кнопку с классом tg-auth-button — всё по документации:
 * https://core.telegram.org/bots/telegram-login
 */

import { useEffect, useRef, useState } from 'react';

interface TelegramLoginWidgetProps {
  clientId: string;
  onAuth: (idToken: string) => void;
  onError?: (error: string) => void;
  buttonSize?: 'large' | 'medium' | 'small';
}

// Общий колбэк — все экземпляры виджета используют один init
let sharedCallback: ((result: { id_token?: string; error?: string }) => void) | null = null;

function waitForTelegramLogin(): Promise<{ init: (opts: object, cb: (r: unknown) => void) => void }> {
  const Telegram = (window as unknown as { Telegram?: { Login?: { init: (opts: object, cb: (r: unknown) => void) => void } } }).Telegram;
  if (Telegram?.Login) return Promise.resolve(Telegram.Login);
  return new Promise((resolve) => {
    const check = () => {
      const T = (window as unknown as { Telegram?: { Login?: { init: (opts: object, cb: (r: unknown) => void) => void } } }).Telegram;
      if (T?.Login) {
        resolve(T.Login);
        return;
      }
      setTimeout(check, 100);
    };
    check();
  });
}

export function TelegramLoginWidget({
  clientId,
  onAuth,
  onError,
  buttonSize: _buttonSize = 'large',
}: TelegramLoginWidgetProps) {
  const [isReady, setIsReady] = useState(false);
  const onAuthRef = useRef(onAuth);
  const onErrorRef = useRef(onError);
  onAuthRef.current = onAuth;
  onErrorRef.current = onError;

  useEffect(() => {
    sharedCallback = (result) => {
      if (result.error) {
        onErrorRef.current?.(result.error);
      } else if (result.id_token) {
        onAuthRef.current(result.id_token);
      }
    };

    const numericClientId = Number(clientId);
    if (!numericClientId || isNaN(numericClientId)) return;

    waitForTelegramLogin().then((tgLogin) => {
      setIsReady(true);
      tgLogin.init(
        {
          client_id: numericClientId,
          request_access: ['write'],
          lang: 'ru',
        },
        (result: unknown) => {
          sharedCallback?.(result as { id_token?: string; error?: string });
        }
      );
    });

    return () => {
      sharedCallback = null;
    };
  }, [clientId]);

  // Официальная кнопка tg-auth-button — скрипт сам обрабатывает клик и стили
  return (
    <button
      type="button"
      className="tg-auth-button"
      disabled={!clientId || !isReady}
    >
      {isReady ? 'Войти через Telegram' : 'Загрузка...'}
    </button>
  );
}
