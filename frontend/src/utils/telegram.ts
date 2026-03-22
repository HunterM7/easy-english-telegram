export function onTelegramAuth() {
  window.Telegram?.Login.auth(
    { bot_id: import.meta.env.VITE_TELEGRAM_CLIENT_ID },
    (data: unknown) => {
      console.warn(data);
    },
  );
}