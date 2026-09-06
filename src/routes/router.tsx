import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import { AuthCallbackPage } from '@/features/auth/auth-callback-page'
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth/protected-route'
import { ForgotPasswordPage, LoginPage, ResetPasswordPage, SignupPage } from '@/features/auth/auth-pages'
import { ProfilePage } from '@/features/auth/profile-page'
import { DashboardPage, NotFoundPage, PlaceholderPage } from '@/routes/pages'

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'groups', element: <PlaceholderPage title="Groups" description="Create groups, invite members, and optionally set trip dates." /> },
          { path: 'groups/new', element: <PlaceholderPage title="Create a group" description="Group creation will be connected next." /> },
          { path: 'activity', element: <PlaceholderPage title="Activity" description="Your group expense activity will appear here." /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate replace to="/" /> },
])
