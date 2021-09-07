import { render } from '@/lib/testUtils'
import { findByRole, queryByRole, screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import ReleaseGroup from '../../components/releaseGroup'
import withStateMgmt from './withStateMgmt'

describe('ReleaseGroup component', () => {

  const ReleaseGroupWithStateMgmt = withStateMgmt(ReleaseGroup)
  let container, title, releaseList, countLbl, filterIcon, filterDialog
  let rerender, debug

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
      countLbl = await screen.findByText(/^Versions:\W.[0-9]*\Wfiltered out$/)
      filterIcon = screen.getByTitle("Filter the Versions").parentElement
      releaseList = await screen.findByRole('list')
    })

    it('renders the tile', () => {
      expect(title).toBeVisible()
    })

    it('displays a filtered count of "8"', () => {
      expect(countLbl).toHaveTextContent(/^Versions:\W8\Wfiltered out$/)
    })

    it('does not render the filter dialog by default', () => {
      filterDialog = screen.queryByRole('dialog')
      expect(filterDialog).toBeNull()
    })

    // it('sets default country filters to "US" and "??"', () => {
      // userEvent.click(filterIcon)
      // filterDialog = screen.queryByRole('dialog')
      // expect(filterDialog).not.toBeNull()
    // })
  })
})