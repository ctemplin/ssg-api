import { render, screen, within, getAllByRole } from '@/lib/testUtils'
import TestPage from './tests.page.js'

describe('Non-production page for testing various libraries and features.', () => {
  it('Renders TestPage', () => {

    const { container } = render(<TestPage />)

    const headers = screen.getAllByRole('heading', {level: 2})
    expect(headers[0].textContent).toBe('secondary primary')
    expect(headers[1].textContent).toBe('primary')
    expect(headers[2].textContent).toBe('secondary')

    expect(screen.getByText('Countries')).toBeVisible()
    const releaseCountries = screen.getByRole('list')
    // const countries = within(releaseCountries).getAllByRole('listitem')
    const liUs = within(releaseCountries).queryByLabelText('US')
    expect(liUs).toBeVisible()
    expect(liUs).toBeChecked()
    const liCa = within(releaseCountries).queryByLabelText('CA')
    expect(liCa).toBeVisible()
    expect(liCa).not.toBeChecked()
    const liNull = within(releaseCountries).queryByLabelText('ZZ')
    expect(liNull).toBeNull()
  })
})
 