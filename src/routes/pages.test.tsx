import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { DashboardPage, NotFoundPage } from '@/routes/pages'

describe('application states', () => {
  it('renders the dashboard empty state', () => {
    const router = createMemoryRouter([{ path: '/', element: <DashboardPage /> }], { initialEntries: ['/'] })

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: 'No expenses to show' })).toBeInTheDocument()
  })

  it('renders a recovery link for unknown routes', () => {
    const router = createMemoryRouter([{ path: '*', element: <NotFoundPage /> }], { initialEntries: ['/missing'] })

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/')
  })
})
