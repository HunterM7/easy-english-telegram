/**
 * Типы для Telegram Login library.
 * Скрипт загружается с telegram.org и добавляет Telegram в window.
 * @see https://core.telegram.org/bots/telegram-login#using-the-telegram-login-library
 */

export interface TelegramAuthUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramAuthResult {
  id_token?: string;
  user?: TelegramAuthUser;
  error?: string;
}

export interface TelegramLoginInitOptions {
  /** Скрипт ожидает bot_id (документация указывает client_id, но это устарело) */
  bot_id: number;
  request_access?: ('phone' | 'write')[];
  lang?: string;
  nonce?: string;
}

interface TelegramLoginAPI {
  init: (
    options: TelegramLoginInitOptions,
    callback: (result: TelegramAuthResult) => void
  ) => void;
  open: (callback?: (result: TelegramAuthResult) => void) => void;
  auth: (
    options: TelegramLoginInitOptions,
    callback: (result: TelegramAuthResult) => void
  ) => void;
}

declare global {
  interface Window {
    Telegram?: {
      Login: TelegramLoginAPI;
    };
  }
}
