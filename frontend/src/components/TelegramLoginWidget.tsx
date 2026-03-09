/**
 * @fileoverview Компонент Telegram Login Widget.
 *
 * Встраивает официальный виджет авторизации Telegram в React-приложение.
 * Используется для авторизации в браузерной версии (не в Mini App).
 *
 * Требования:
 * - Домен должен быть настроен в @BotFather через /setdomain
 * - Не работает на localhost (нужен ngrok или реальный домен)
 *
 * @see https://core.telegram.org/widgets/login
 */

import { useEffect, useRef, useId } from 'react';
import type { TelegramWidgetData } from '#src/services/auth';

interface TelegramLoginWidgetProps {
  /** Имя бота (без @), например 'EasyEnglishBot' */
  botName: string;
  /** Колбэк, вызываемый после успешной авторизации */
  onAuth: (data: TelegramWidgetData) => void;
  /** Размер кнопки */
  buttonSize?: 'large' | 'medium' | 'small';
  /** Радиус скругления углов */
  cornerRadius?: number;
  /** Запросить разрешение на отправку сообщений */
  requestAccess?: 'write';
  /** Показывать аватар пользователя */
  usePic?: boolean;
  /** Язык интерфейса виджета */
  lang?: string;
}

/**
 * Компонент Telegram Login Widget.
 *
 * Динамически загружает скрипт виджета от Telegram и рендерит кнопку авторизации.
 * После успешной авторизации вызывает onAuth с данными пользователя.
 *
 * @example
 * ```tsx
 * <TelegramLoginWidget
 *   botName="EasyEnglishBot"
 *   onAuth={(data) => handleTelegramLogin(data)}
 *   buttonSize="large"
 * />
 * ```
 */
export function TelegramLoginWidget({
  botName,
  onAuth,
  buttonSize = 'large',
  cornerRadius = 8,
  requestAccess,
  usePic = true,
  lang = 'ru',
}: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, '_');
  const callbackNameRef = useRef<string>(`TelegramLoginWidget_${uniqueId}`);
  const onAuthRef = useRef(onAuth);

  useEffect(() => {
    onAuthRef.current = onAuth;
  }, [onAuth]);

  useEffect(() => {
    const callbackName = callbackNameRef.current;
    (window as unknown as Record<string, unknown>)[callbackName] = (data: TelegramWidgetData) => {
      onAuthRef.current(data);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', String(cornerRadius));
    script.setAttribute('data-onauth', `${callbackName}(user)`);
    script.setAttribute('data-userpic', String(usePic));
    script.setAttribute('data-lang', lang);

    if (requestAccess) {
      script.setAttribute('data-request-access', requestAccess);
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }

    return () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, usePic, lang]);

  return <div ref={containerRef} />;
}
