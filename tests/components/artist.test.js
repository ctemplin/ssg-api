import '@testing-library/react/dont-cleanup-after-each'
import { render } from '@/lib/testUtils'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Artist from '../../components/artist'
import withStateMgmt from './withStateMgmt'

describe('Artist component', () => {

  const ArtistWithStateMgmt = withStateMgmt(Artist)
  let title, container, resultsList, typeHeaders, listItems
  const groupCount = 7
  const liCount = 20
  const sortIconAttrName = 'data-icon'
  const sortIconAttrVal = {asc: 'sort-amount-up', desc: 'sort-amount-down'}

  beforeAll(async() => {
    container = render(
      <ArtistWithStateMgmt id={'e13d2935-8c42-4c0a-96d7-654062acf106'} />
    ).container

    title = await screen.findByText( (content, node) => {
      if(node.tagName == 'H2') {
        return node.textContent == ["Artist", "Neko Case", "Sep 8, 1970 to present"].join('')
      }
      return false
    })

    resultsList = await container.querySelector('.resultsList')
  })

  it('initially groups releaseGroups by type and sorts them by date.', () => {
    typeHeaders = within(resultsList).getAllByRole('group')
    expect(typeHeaders).toHaveLength(groupCount)
    listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(liCount)
    expect(listItems[0]).toHaveTextContent("Blacklisted")
    expect(listItems[6]).toHaveTextContent("Truckdriver Gladiator Mule")
  })

  describe('Sort options', () => {
    let sortDialog, sortOptions, sortIcon

    beforeAll(() => {
      sortDialog = screen.getByRole("dialog")
      sortOptions = within(sortDialog).getAllByRole('checkbox')
      sortIcon = screen.getByTitle("Sort the Releases").parentElement
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
      expect(sortIcon).toBeVisible()
      expect(sortIcon).toHaveAttribute(sortIconAttrName, sortIconAttrVal.asc)
    })

    it('displays/hides the sort dialog when the icon is clicked.', () => {
      userEvent.click(sortIcon)
      expect(sortDialog).not.toHaveClass("sortMenuHidden")
      userEvent.click(sortIcon)
      expect(sortDialog).toHaveClass("sortMenuHidden")
      userEvent.click(sortIcon)
      expect(sortDialog).not.toHaveClass("sortMenuHidden")
    })

    it('hides the sort menu when an option is clicked.', () => {
      userEvent.click(sortIcon)
      userEvent.click(sortOptions[1])
      expect(sortDialog).toHaveClass("sortMenuHidden")
    })

    it('updates checks when an option is clicked.', () => {
      userEvent.click(sortIcon)
      userEvent.click(sortOptions[1])
      expect(sortDialog).toHaveClass("sortMenuHidden")
      expect(sortOptions[0]).not.toBeChecked()
      expect(sortOptions[1]).toBeChecked()
      expect(sortOptions[2]).not.toBeChecked()
    })

    describe.each([
      [ 'Type/Date', true,  'Blacklisted', 'Man'],
      [ 'Title',     false, '2000-03-30: Republik, Calgary', 'iTunes Originals'],
      [ 'Date',      false, 'Car Songs', '2004-07-16: The Fillmore, San Franci']
    ])('by %s', (sortText, expectGroups, firstTitle, lastTitle) => {

      describe('in ascending order', () => {
        beforeAll(() => {
          // open the menu
          if (sortDialog.className === 'sortMenuHidden') {
            userEvent.click(sortIcon)
          }
          // click the checkbox, if sort column/direction aren't already correct
          let cb = within(sortDialog).getByRole('checkbox', {name: sortText})
          let alreadyChecked = cb.attributes['aria-checked'].value === "true"
          let wrongSortDirection = sortIcon[sortIconAttrName] === sortIconAttrVal.desc
          if ( !alreadyChecked || wrongSortDirection) {
            userEvent.click(cb)
          }
          listItems = screen.getAllByRole('listitem')
          resultsList = container.querySelector('.resultsList')
          typeHeaders = within(resultsList).queryAllByRole('group')
        })

        it(`displays "${sortIconAttrVal.asc}" icon`, () =>
          expect(sortIcon).toHaveAttribute(sortIconAttrName, sortIconAttrVal.asc)
        )

        if (expectGroups) {
          it('displays group headers', () => {
            expect(typeHeaders).toHaveLength(groupCount)
          })
        } else {
          it('removes group headers', () => {
            typeHeaders = within(resultsList).queryAllByRole('group')
            expect(typeHeaders).toHaveLength(0)
          })
        }

        it('maintains item count', () => {
          expect(listItems).toHaveLength(liCount)
        })

        it(`places "${firstTitle}" first`, () => {
          expect(listItems[0]).toHaveTextContent(firstTitle)
        })

        it(`places "${lastTitle}" last (#${liCount-1})`, () => {
          expect(listItems[liCount-1]).toHaveTextContent(lastTitle)
        })
      })

      describe('in descending order', () => {
        beforeAll(() => {
          // reverse sort -- depends on parent describe's beforeAll()
          userEvent.click(within(sortDialog).getByText(sortText))
          listItems = screen.getAllByRole('listitem')
          resultsList = container.querySelector('.resultsList')
          typeHeaders = within(resultsList).queryAllByRole('group')
        })

        it(`displays "${sortIconAttrVal.desc}" icon`, () =>
          expect(sortIcon).toHaveAttribute(sortIconAttrName, sortIconAttrVal.desc)
        )

        if (expectGroups) {
          it('displays group headers', () => {
            expect(typeHeaders).toHaveLength(groupCount)
          })
        } else {
          it('removes group headers', () => {
            expect(typeHeaders).toHaveLength(0)
          })
        }

        it('maintains item count', () => {
          expect(listItems).toHaveLength(liCount)
        })

        it(`places "${firstTitle}" last (#${liCount-1})`, () => {
          expect(listItems[liCount-1]).toHaveTextContent(firstTitle)
        })

        it(`places "${lastTitle}" first`, () => {
          expect(listItems[0]).toHaveTextContent(lastTitle)
        })
      })

    })
  })
})