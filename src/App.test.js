import {render, screen,fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import '@testing-library/jest-dom'
import {App,LocationDisplay} from './App'
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

test('full app rendering/navigating', async () => {
  render(<Router><App /></Router>)
  // verify page content for default route
  expect(screen.getByText(/find game/i)).toBeInTheDocument()
  // verify page content for expected route after navigating
   fireEvent.click(screen.getByText(/login/i))
   await expect(screen.getByText(/login page/i)).toBeInTheDocument()
   expect(screen.getByTestId('location-display')).toHaveTextContent('/login')

})