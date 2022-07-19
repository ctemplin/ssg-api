import '@testing-library/react/dont-cleanup-after-each'
import { render } from '@/lib/testUtils'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Artist from '../../components/artist'
import withStateMgmt from './withStateMgmt'

describe('Artist component', () => {

  const ArtistWithStateMgmt = withStateMgmt(Artist)
  let cleanup, container
  let title, resultsList, typeHeaders, listItems
  const groupCount = 7
  const liCount = 20
  const sortIconAttrName = 'data-icon'
  const sortIconAttrVal = {asc: 'arrow-up-wide-short', desc: 'arrow-down-wide-short'}

  beforeAll(async() => {
    ({ cleanup, container } = render(
      <ArtistWithStateMgmt id={'e13d2935-8c42-4c0a-96d7-654062acf106'} />
    ))

    title = await screen.findByText( (content, node) => {
      if(node.tagName == 'H2') {
        return node.textContent == ["Artist", "Neko Case", "Sep 8, 1970 to present"].join('')
      }
      return false
    })

    resultsList = await container.querySelector('.resultsList')
  })

  afterAll(() => cleanup)

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

    it('displays/hides the sort dialog when the icon is clicked.', async () => {
      await userEvent.click(sortIcon)
      expect(sortDialog).not.toHaveClass("sortMenuHidden")
      await userEvent.click(sortIcon)
      expect(sortDialog).toHaveClass("sortMenuHidden")
      await userEvent.click(sortIcon)
      expect(sortDialog).not.toHaveClass("sortMenuHidden")
    })

    describe.each([0, 1, 2])('#%d', index => {
      it('hides the sort menu when clicked.', async () => {
        await userEvent.click(sortIcon)
        await userEvent.click(sortOptions[index])
        expect(sortDialog).toHaveClass("sortMenuHidden")
      })
    })

    describe.each([
      [ 0, [1,2]],
      [ 1, [0,2]],
      [ 2, [0,1]]
    ])('#%d', ( activeIndex, otherIndices) => {
      it('updates checks when clicked.', async () => {
        await userEvent.click(sortIcon)
        await userEvent.click(sortOptions[activeIndex])
        expect(sortDialog).toHaveClass("sortMenuHidden")
        expect(sortOptions[activeIndex]).toBeChecked()
        expect(sortOptions[otherIndices[0]]).not.toBeChecked()
        expect(sortOptions[otherIndices[1]]).not.toBeChecked()
      })
    })

    describe.each([
      [ 'Type/Date', true,  'Blacklisted', 'Man'],
      [ 'Title',     false, '2000-03-30: Republik, Calgary', 'iTunes Originals'],
      [ 'Date',      false, 'Car Songs', '2004-07-16: The Fillmore, San Franci']
    ])('by %s', (sortText, expectGroups, firstTitle, lastTitle) => {

      describe('in ascending order', () => {
        beforeAll(async () => {
          // open the menu
          if (sortDialog.className === 'sortMenuHidden') {
            await userEvent.click(sortIcon)
          }
          // click the checkbox, if sort column/direction aren't already correct
          let cb = within(sortDialog).getByRole('checkbox', {name: sortText})
          let alreadyChecked = cb.attributes['aria-checked'].value === "true"
          let wrongSortDirection = sortIcon[sortIconAttrName] === sortIconAttrVal.desc
          if ( !alreadyChecked || wrongSortDirection) {
            await userEvent.click(cb)
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
        beforeAll(async () => {
          // reverse sort -- depends on parent describe's beforeAll()
          await userEvent.click(within(sortDialog).getByText(sortText))
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