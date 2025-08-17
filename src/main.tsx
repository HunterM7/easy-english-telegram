import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App/App.tsx'
import { isTMA, mockTelegramEnv } from '@telegram-apps/sdk-react';
import './index.css'

if (!isTMA()) {
  // Debug environment - имитируем Telegram
  mockTelegramEnv({
    launchParams: {
      tgWebAppData: new URLSearchParams([
        ['user', JSON.stringify({
          id: 1,
          first_name: 'Pavel Durov',
        })],
        ['hash', ''],
        ['signature', ''],
        ['auth_date', Date.now().toString()],
      ]),
      tgWebAppStartParam: 'debug',
      tgWebAppVersion: '8',
      tgWebAppPlatform: 'tdesktop',
      tgWebAppThemeParams: {
        bg_color: '#ffffff',
        text_color: '#000000',
        hint_color: '#999999',
        link_color: '#2481cc',
        button_color: '#2481cc',
        button_text_color: '#ffffff',
      },
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
