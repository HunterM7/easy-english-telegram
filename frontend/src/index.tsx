import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { isTMA } from '@telegram-apps/sdk-react';
import { mockTelegramData } from '#src/utils/mockTelegramData';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '#src/contexts/AuthContext';
import { ProtectedRoute } from '#src/components/ProtectedRoute';
import { GuestRoute } from '#src/components/GuestRoute';
import { HomePage } from '#src/pages/home-page/home-page';
import { ErrorPage } from '#src/pages/error-page/error-page';
import { LessonsPage } from '#src/pages/lessons-page/lessons-page';
import { LessonPage } from '#src/pages/lesson-page/lesson-page';
import { LandingPage } from '#src/pages/landing-page/landing-page';
import './index.scss';

const IS_DEV = import.meta.env.DEV;
const USE_MOCK = IS_DEV && import.meta.env.VITE_USE_REAL_AUTH !== 'true';

if (USE_MOCK && !isTMA()) {
  mockTelegramData();
}

const router = createBrowserRouter([
  {
    path: '/landing',
    element: (
      <GuestRoute>
        <LandingPage />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/lessons',
    element: (
      <ProtectedRoute>
        <LessonsPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/lessons/:id',
    element: (
      <ProtectedRoute>
        <LessonPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
