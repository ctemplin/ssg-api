import { render, screen, within, getAllByRole } from '@/lib/testUtils'
import TestPage from './tests.page.js'

describe('Non-production page for testing various libraries and features.', () => {
  it('Renders TestPage', () => {

    const { container } = render(<TestPage />)

  })
})
