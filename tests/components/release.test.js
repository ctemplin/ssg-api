import { render } from '@/lib/testUtils'
import { queryByRole, screen, waitForElementToBeRemoved } from '@testing-library/dom'
import Release from '../../components/release'
import withStateMgmt from './withStateMgmt'

describe('Renders a release with various groups.', () => {

  const ReleaseWithStateMgmt = withStateMgmt(Release)

  it('renders a Release block with no media/tracks', async() => {
    render(
      <ReleaseWithStateMgmt id={'553912a9-2b42-40da-98ea-d8c2e63b9dfb'} />
    )

    await waitForElementToBeRemoved(() => 
      document.querySelector('.resultBlockLoadingIcon'))
    let recList = await screen.findByRole('list')
    let recs = queryByRole(recList, 'listitem')
    expect(recs).toBeNull()
  })
})