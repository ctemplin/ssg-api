import '@testing-library/react/dont-cleanup-after-each'
import { render } from '@/lib/testUtils'
import { getByRole, getAllByRole, getByText, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReleaseGroup from '../../components/releaseGroup'
import withStateMgmt from './withStateMgmt'

describe('ReleaseGroup component', () => {
  const ReleaseGroupWithStateMgmt = withStateMgmt(ReleaseGroup)
  let container, title, countLbl, filterLbl, filterIcon, filterDialog, releaseList

  describe('with normal data', () => {
    beforeAll(async() => {
      container = render(
        <ReleaseGroupWithStateMgmt id={'1efdef9a-b88f-43bf-90af-f22fa23df26f'} />
      ).container

      title = await screen.findByText( (content, node) => {
        if(node.tagName == 'H2') {
          return node.textContent == ["Release", "Hot Rats", "Oct 15, 1969"].join('')
        }
        return false
      })
      countLbl = await screen.findByText(/^Versions:\W.[0-9]*\Wfound$/)
      filterLbl = await screen.findByText(/^[0-9]* filtered out$/)
      filterDialog = await screen.findByRole('dialog')
      filterIcon = screen.getByTitle("Filter the Versions").parentElement
      releaseList = await screen.findByLabelText(/^Versions:.*/)
    })

    it('renders the tile', () => {
      expect(title).toBeVisible()
    })

    it('displays a found count of "16"', () => {
      expect(countLbl).toHaveTextContent(/^Versions:\W16\Wfound$/)
    })

    it('displays a filtered count of "8"', () => {
      expect(filterLbl).toHaveTextContent(/^8\Wfiltered\Wout$/)
    })

    it('does not displays the filter dialog by default', () => {
      expect(filterDialog).toHaveClass('hidden')
    })

    describe('with clicked filter icon', () => {
      let countryList, countries

      beforeAll(async () => {
        userEvent.click(filterIcon)
        countryList = getByRole(filterDialog, 'list')
        countries = getAllByRole(countryList, 'listitem')
      })

      it('displays the filter dialog', async() => {
        expect(filterDialog).not.toHaveClass('hidden')
      })

      it('displays 7 countries and one extra for "All"', () => {
        expect(countries).toHaveLength(7 + 1)
      })

      it('checks the boxes for "US" and "??" and none other by default', () => {
        let expectedCheckedValues = ['US', '??']
        countries.forEach((i, ind) => {
          // skip the "All" checkbox
          if (ind === 0) { return }
          let cb = getByRole(i, 'checkbox')
          if (expectedCheckedValues.includes(cb.name)){
            expect(cb).toBeChecked()
          } else {
            expect(cb).not.toBeChecked()
          }
        })
      })

      it('removes list items when countries are unchecked', async() => {
        let usCbLbl = screen.getByLabelText('US')
        userEvent.click(usCbLbl)
        expect(usCbLbl).not.toBeChecked()
        expect(filterLbl).toHaveTextContent(/^13\Wfiltered\Wout$/)
        expect(getAllByRole(releaseList, 'listitem')).toHaveLength(3)
      })

      it('adds list items when countries are unchecked', async() => {
        let xeCbLbl = screen.getByLabelText('XE')
        expect(xeCbLbl).not.toBeChecked()
        userEvent.click(xeCbLbl)
        expect(xeCbLbl).toBeChecked()
        expect(filterLbl).toHaveTextContent(/^10\Wfiltered\Wout$/)
        expect(getAllByRole(releaseList, 'listitem')).toHaveLength(6)
      })

      it('hides the filter dialog', async() => {
        userEvent.click(filterIcon)
        expect(filterDialog).toHaveClass('hidden')
      })

    })
  })
})