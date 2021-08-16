import { render } from '@/lib/testUtils'
import { screen, getAllByRole } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import Artist from '../../components/artist'
import withStateMgmt from './withStateMgmt'

describe('Renders artist list of releaseGroups with various groups.', () => {

  const ArtistWithStateMgmt = withStateMgmt(Artist)

  it('', () => {
    render(<ArtistWithStateMgmt />)

    let typeHeaders = screen.getAllByRole('group')
    expect(typeHeaders).toHaveLength(7)
    let listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(20)

    expect(listItems[0]).toHaveTextContent("Blacklisted")
    expect(listItems[6]).toHaveTextContent("Truckdriver Gladiator Mule")

    let sortDialog = screen.getByRole("dialog")
    expect(sortDialog).toHaveClass("sortMenuHidden")
    let filterIcon = screen.getByTitle("Sort the Releases").parentElement
    expect(filterIcon).toBeVisible()
    userEvent.click(filterIcon)
    expect(sortDialog).not.toHaveClass("sortMenuHidden")
    let sortOptions = getAllByRole(sortDialog, 'checkbox')
    expect(sortOptions).toHaveLength(3)
    expect(sortOptions[0]).toBeChecked()
    expect(sortOptions[1]).not.toBeChecked()
    expect(sortOptions[2]).not.toBeChecked()
    userEvent.click(sortOptions[1])
    expect(sortDialog).toHaveClass("sortMenuHidden")
  })
})