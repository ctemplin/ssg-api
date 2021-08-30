import { render } from '@/lib/testUtils'
import { findAllByRole, queryByRole, screen, waitForElementToBeRemoved } from '@testing-library/dom'
import Release from '../../components/release'
import withStateMgmt from './withStateMgmt'

describe('Release component', () => {

  const ReleaseWithStateMgmt = withStateMgmt(Release)
  let container, title, date, recList, countLbl

  describe('without media/tracks/recordings', () => {
    beforeAll(async() => {
      container = render(
        <ReleaseWithStateMgmt id={'553912a9-2b42-40da-98ea-d8c2e63b9dfb'} />
      ).container
      await waitForElementToBeRemoved(() =>
        document.querySelector('.resultBlockLoadingIcon'))
      date = await screen.findByText('Apr 10, 2020')
      title = await screen.findByText('Bang Bang Rock & Roll')
      countLbl = await screen.findByText(/^Tracks:\W.[0-9]*\Wfound$/)
      recList = await screen.findByRole('list')
    })

    it('renders the tile', () => {
      expect(title).toBeVisible()
    })

    it('renders date as direct child of <H2>', () => {
      expect(date).toHaveClass('blockHeaderDate')
      expect(date.parentElement).toHaveClass('blockTypeH')
      expect(date.parentElement).toBeInstanceOf(HTMLHeadingElement)
    })

    it('diplays a count of "0"', () => {
      expect(countLbl).toHaveTextContent(/^Tracks:\W0\Wfound$/)
    })

    it('renders zero children in the results list.', async() => {
      let recs = queryByRole(recList, 'listitem')
      expect(recs).toBeNull()
    })
  })

  describe('with media/tracks/recordings', () => {
    let thumbnail, date
    let rid = 'deec603f-bb01-4094-b538-25e5fe62ed86'
    beforeAll(async() => {
      container = render(
        <ReleaseWithStateMgmt id={rid} />
      ).container
      await waitForElementToBeRemoved(() =>
        document.querySelector('.resultBlockLoadingIcon'))
      // wait for thumbnail render to get other elements
      thumbnail = await screen.findByAltText("Album Art Thumbnail", {exact: false}, {timeout: 4000})
      title = await screen.findByText('Much Les')
      date = await screen.findByText('1969')
      countLbl = await screen.findByText(/^Tracks:\W.[0-9]*\Wfound$/)
      recList = await screen.findByRole('list')
    })

    it('renders the tile', () => {
      expect(title).toBeVisible()
    })

    it('diplays a  count of "6"', () => {
      expect(countLbl).toHaveTextContent(/^Tracks:\W6\Wfound$/)
    })

    it('renders six children in the results list.', async() => {
      let recs = await findAllByRole(recList, 'listitem')
      expect(recs).toHaveLength(6)
    })

    it('renders date as a sibling of the title', async() => {
      expect(date).toHaveClass('blockHeaderDate')
      expect(date.parentElement.parentElement).toHaveClass('blockHeader')
      expect(date.parentElement).toContainElement(title)
    })

    it('renders the thumbnail', () => {
      let rg = new RegExp(
        "/_next/image?url=http%3A%2F%2Fcoverartarchive.org%2Frelease%2F" + rid + ".*"
      ).compile()
      expect(thumbnail).toHaveAttribute('src', expect.stringMatching(rg))
    })
  })
})