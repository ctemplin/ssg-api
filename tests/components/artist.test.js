import { render } from '@/lib/testUtils'
import { screen, getAllByRole, getByText } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Artist from '../../components/artist'
import withStateMgmt from './withStateMgmt'

describe('Artist component', () => {

  const ArtistWithStateMgmt = withStateMgmt(Artist)
  let typeHeaders, listItems
  const liCount = 20

  beforeEach(() => render(<ArtistWithStateMgmt />))

  it('initially groups releaseGroups by type and sorts them by date.', () => {
    typeHeaders = screen.getAllByRole('group')
    expect(typeHeaders).toHaveLength(7)
    listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(liCount)
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

    it('displays the sort dialog when the icon is clicked.', () => {
      userEvent.click(filterIcon)
      expect(sortDialog).not.toHaveClass("sortMenuHidden")
    })

    it('hides the sort menu when an option is clicked.', () => {
      userEvent.click(filterIcon)
      userEvent.click(sortOptions[1])
      expect(sortDialog).toHaveClass("sortMenuHidden")
    })

    it('updates checks when an option is clicked.', () => {
      userEvent.click(filterIcon)
      userEvent.click(sortOptions[1])
      expect(sortDialog).toHaveClass("sortMenuHidden")
      expect(sortOptions[0]).not.toBeChecked()
      expect(sortOptions[1]).toBeChecked()
      expect(sortOptions[2]).not.toBeChecked()
    })

    describe.each([
      ['Title', 3, "Be and Bring Me Home", 17, "Truckdriver Gladiator Mule"],
      ['Date',  0, "Car Songs",            16, "Be and Bring Me Home"]
    ])('by %s', (sortText, index1, title1, index2, title2) => {

      beforeEach(() => {
        userEvent.click(filterIcon)
        userEvent.click(getByText(sortDialog, sortText))
        listItems = screen.getAllByRole('listitem')
      })

      describe('in ascending order', () => {
        it('removes group headers', () => {
          typeHeaders = screen.queryByRole('group')
          expect(typeHeaders).toBeNull()
        })

        it('maintains item count', () => {
          expect(listItems).toHaveLength(liCount)
        })

        it(`places "${title1}" at #${index1}`, () => {
          expect(listItems[index1]).toHaveTextContent(title1)
        })

        it(`places "${title2}" at #${index2}`, () => {
          expect(listItems[index2]).toHaveTextContent(title2)
        })
      })

      describe('in descending order', () => {
        beforeEach(() => {
          userEvent.click(filterIcon)
          userEvent.click(getByText(sortDialog, sortText))
          listItems = screen.getAllByRole('listitem')
        })

        it('removes group headers', () => {
          typeHeaders = screen.queryByRole('group')
          expect(typeHeaders).toBeNull()
        })

        it('maintains item count', () => {
          expect(listItems).toHaveLength(liCount)
        })

        it(`places "${title1}" at #${liCount-1-index1}`, () => {
          expect(listItems[liCount-1-index1]).toHaveTextContent(title1)
        })

        it(`places "${title2}" at #${liCount-1-index2}`, () => {
          expect(listItems[liCount-1-index2]).toHaveTextContent(title2)
        })
      })

    })
  })
})