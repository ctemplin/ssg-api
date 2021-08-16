import { render } from '@/lib/testUtils'
import { screen, getAllByRole } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import Artist from '../../components/artist'
import withStateMgmt from './withStateMgmt'

describe('Artist component', () => {

  const ArtistWithStateMgmt = withStateMgmt(Artist)

  beforeEach(() => render(<ArtistWithStateMgmt />))

  it('initially groups releaseGroups by type and sorts them by date.', () => {
    let typeHeaders = screen.getAllByRole('group')
    expect(typeHeaders).toHaveLength(7)
    let listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(20)
    expect(listItems[0]).toHaveTextContent("Blacklisted")
    expect(listItems[6]).toHaveTextContent("Truckdriver Gladiator Mule")
  })

  describe('Sort options', () => {
    let sortDialog, sortOptions, filterIcon

    beforeEach(() => {
      sortDialog = screen.getByRole("dialog")
      sortOptions = getAllByRole(sortDialog, 'checkbox')
      filterIcon = screen.getByTitle("Sort the Releases").parentElement
    })

    it('hides the sort dialog by default.', () => {
      expect(sortDialog).toHaveClass("sortMenuHidden")
    })

    it('contains three sort options.', () => {
      expect(sortOptions).toHaveLength(3)
    })

    it('checks only the first sort option by default.', () => {
      expect(sortOptions[0]).toBeChecked()
      expect(sortOptions[1]).not.toBeChecked()
      expect(sortOptions[2]).not.toBeChecked()
    })

    it('displays the sort icon.', () => {
      expect(filterIcon).toBeVisible()
    })

    it('displays the sort dialog on icon click.', () => {
      userEvent.click(filterIcon)
      expect(sortDialog).not.toHaveClass("sortMenuHidden")
    })

    it('hides the sort menu after option is clicked', () => {
      userEvent.click(sortOptions[1])
      expect(sortDialog).toHaveClass("sortMenuHidden")
    })
  })

})