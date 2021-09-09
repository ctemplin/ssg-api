import '@testing-library/react/dont-cleanup-after-each'
import { render } from '@/lib/testUtils'
import { getByRole, getAllByRole, queryByLabelText, screen } from '@testing-library/react'
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

    describe('opens filter config UI', () => {
      let countryList, countries, expectedCheckedValues

      beforeAll(async () => {
        countryList = getByRole(filterDialog, 'list')
        countries = getAllByRole(countryList, 'listitem')
      })

      beforeEach(() => {
        // open the filter UI
        expect(filterDialog).toHaveClass('hidden')
        userEvent.click(filterIcon)
        expect(filterDialog).not.toHaveClass('hidden')
        expectedCheckedValues = ['US', '??']
      })

      afterEach(() => {
        // reset checkboxes to expected values only
        countries.forEach((i) => {
          let cb = getByRole(i, 'checkbox')
          if (expectedCheckedValues.includes(cb.name)){
            if (!cb.checked) {userEvent.click(i)}
          } else {
            if (cb.checked) {userEvent.click(i)}
          }
        })
        // close the filter UI
        expect(filterDialog).not.toHaveClass('hidden')
        userEvent.click(filterIcon)
        expect(filterDialog).toHaveClass('hidden')
      })

      it('displays 7 countries', () => {
        expect(countries).toHaveLength(7)
      })

      it('checks the boxes for "US" and "??" and none other by default', () => {
        expectedCheckedValues.forEach((code) => 
          {
            let cb = queryByLabelText(countryList, code)
            expect(cb).not.toBeNull()
          }
        )
        countries.forEach((i, ind) => {
          let cb = getByRole(i, 'checkbox')
          if (expectedCheckedValues.includes(cb.name)){
            expect(cb).toBeChecked()
          } else {
            expect(cb).not.toBeChecked()
          }
        })
      })

      it('removes list items when countries are unchecked', () => {
        let usCbLbl = screen.getByLabelText('US')
        userEvent.click(usCbLbl)
        expect(usCbLbl).not.toBeChecked()
        expect(filterLbl).toHaveTextContent(/^13\Wfiltered\Wout$/)
        expect(getAllByRole(releaseList, 'listitem')).toHaveLength(3)
      })

      it('adds list items when countries are checked', () => {
        let xeCbLbl = screen.getByLabelText('XE')
        expect(xeCbLbl).not.toBeChecked()
        userEvent.click(xeCbLbl)
        expect(xeCbLbl).toBeChecked()
        expect(filterLbl).toHaveTextContent(/^5\Wfiltered\Wout$/)
        expect(getAllByRole(releaseList, 'listitem')).toHaveLength(11)
      })
    })
  })
})