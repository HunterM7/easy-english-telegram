/**
 * @fileoverview Legacy Telegram Login Widget.
 *
 * Использует старый виджет (telegram.org) — без oauth.telegram.org,
 * без ошибки "origin required". Домен привязывается через /setdomain в BotFather.
 *
 * @see https://core.telegram.org/widgets/login
 */

import { useEffect, useRef } from 'react';
import type { TelegramWidgetData } from '#src/services/auth';

interface TelegramLoginWidgetProps {
  /** Имя бота без @ (например: EasyEnglishBot) */
  botName: string;
  onAuth: (data: TelegramWidgetData) => void;
  onError?: (error: string) => void;
  buttonSize?: 'large' | 'medium' | 'small';
}

const SCRIPT_ID = 'telegram-login-widget';
const SCRIPT_URL = 'https://telegram.org/js/telegram-widget.js?22';

export function TelegramLoginWidget({
  botName,
  onAuth,
  onError,
  buttonSize = 'large',
}: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onAuthRef = useRef(onAuth);
  const onErrorRef = useRef(onError);
  onAuthRef.current = onAuth;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!botName?.trim()) {
      onErrorRef.current?.('Bot name not configured');
      return;
    }

    const callbackName = `__tgLogin_${Date.now()}`;
    (window as unknown as Record<string, (user: TelegramWidgetData) => void>)[callbackName] = (user: TelegramWidgetData) => {
      if (!user?.id || !user?.hash) {
        onErrorRef.current?.('Invalid widget data');
        return;
      }
      onAuthRef.current(user);
    };

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.async = true;
    script.setAttribute('data-telegram-login', botName.trim());
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-onauth', `${callbackName}(user)`);
    script.setAttribute('data-request-access', 'write');
    container.appendChild(script);

    return () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      const existing = document.getElementById(SCRIPT_ID);
      if (existing) existing.remove();
    };
  }, [botName, buttonSize]);

  return <div ref={containerRef} className="telegram-login-widget" />;
}
