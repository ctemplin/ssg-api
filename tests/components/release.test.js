import { render } from '@/lib/testUtils'
import { findAllByRole, queryByRole, screen, waitForElementToBeRemoved } from '@testing-library/dom'
import Release from '../../components/release'
import withStateMgmt from './withStateMgmt'

describe('Renders a release', () => {

  const ReleaseWithStateMgmt = withStateMgmt(Release)
  let container, recList, countLbl

  describe('without media/tracks/recordings', () => {
    beforeAll(async() => {
      container = render(
        <ReleaseWithStateMgmt id={'553912a9-2b42-40da-98ea-d8c2e63b9dfb'} />
      ).container
      await waitForElementToBeRemoved(() =>
        document.querySelector('.resultBlockLoadingIcon'))
      countLbl = await screen.findByText(/^Tracks:\W.[0-9]*\Wfound$/)
      recList = await screen.findByRole('list')
    })

    it('diplays a count of "0".', () => {
      expect(countLbl).toHaveTextContent(/^Tracks:\W0\Wfound$/)
    })

    it('renders zero children in the results list.', async() => {
      let recs = queryByRole(recList, 'listitem')
      expect(recs).toBeNull()

    })
  })

  describe('with media/tracks/recordings', () => {
    beforeAll(async() => {
      container = render(
        <ReleaseWithStateMgmt id={'deec603f-bb01-4094-b538-25e5fe62ed86'} />
      ).container
      await waitForElementToBeRemoved(() =>
        document.querySelector('.resultBlockLoadingIcon'))
      countLbl = await screen.findByText(/^Tracks:\W.[0-9]*\Wfound$/)
      recList = await screen.findByRole('list')
    })

    it('diplays a  count of "6".', () => {
      expect(countLbl).toHaveTextContent(/^Tracks:\W6\Wfound$/)
    })

    it('renders six children in the results list.', async() => {
      let recs = await findAllByRole(recList, 'listitem')
      expect(recs).toHaveLength(6)
    })
  })
})