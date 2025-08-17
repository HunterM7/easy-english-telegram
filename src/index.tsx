import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { isTMA } from '@telegram-apps/sdk-react';
import { mockTelegramData } from './utils/mockTelegramData.ts';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from './pages/home-page/home-page.tsx'
import { ErrorPage } from './pages/error-page/error-page.tsx';
import { LessonsPage } from './pages/lessons-page/lessons-page.tsx';
import './index.css'

if (!isTMA()) {
  // Если окружение не Telegram Mini Apps, то имитируем его.
  mockTelegramData()
}

const router = createBrowserRouter([
  {
    path: "",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'lessons',
    element: <LessonsPage />,
    errorElement: <ErrorPage />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
