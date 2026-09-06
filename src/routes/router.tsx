import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import { DashboardPage, NotFoundPage, PlaceholderPage } from '@/routes/pages'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'groups',
        element: <PlaceholderPage title="Groups" description="Create groups, invite members, and optionally set trip dates." />,
      },
      {
        path: 'groups/new',
        element: <PlaceholderPage title="Create a group" description="Group creation will be connected after authentication is in place." />,
      },
      {
        path: 'activity',
        element: <PlaceholderPage title="Activity" description="Your group expense activity will appear here." />,
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
