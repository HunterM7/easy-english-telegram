import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App/App.tsx'
import { isTMA } from '@telegram-apps/sdk-react';
import { mockTelegramData } from './utils/mockTelegramData.ts';
import './index.css'

if (!isTMA()) {
  // Если окружение не Telegram Mini Apps, то имитируем его.
  mockTelegramData()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
