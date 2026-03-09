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

import { LoginButton } from '@telegram-auth/react';
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
 * Использует @telegram-auth/react для надёжной авторизации.
 * После успешной авторизации вызывает onAuth с данными пользователя.
 */
export function TelegramLoginWidget({
  botName,
  onAuth,
  buttonSize = 'large',
  cornerRadius = 8,
  lang = 'ru',
}: TelegramLoginWidgetProps) {
  return (
    <LoginButton
      botUsername={botName}
      onAuthCallback={(data) => {
        onAuth({
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          photo_url: data.photo_url,
          auth_date: data.auth_date,
          hash: data.hash,
        });
      }}
      buttonSize={buttonSize}
      cornerRadius={cornerRadius}
      lang={lang}
      showAvatar={true}
    />
  );
}
