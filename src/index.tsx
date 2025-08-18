import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { isTMA } from '@telegram-apps/sdk-react';
import { mockTelegramData } from '#src/utils/mockTelegramData.ts';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from '#src/pages/home-page/home-page';
import { ErrorPage } from '#src/pages/error-page/error-page.tsx';
import { LessonsPage } from '#src/pages/lessons-page/lessons-page.tsx';
import { LessonPage } from '#src/pages/lesson-page/lesson-page.tsx';
import './index.scss'

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
  },
  {
    path: 'lessons/:id',
    element: <LessonPage />,
    errorElement: <ErrorPage />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
