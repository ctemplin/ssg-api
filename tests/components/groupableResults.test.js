import { render, screen, waitFor } from '@/lib/testUtils'
import GroupableResults from '../../components/groupableResults'
import { currentArtistPanelFormatSorted } from '../../models/musicbrainz'
import { useRecoilValue } from 'recoil'
import withStateMgmt from './withStateMgmt'

describe('Renders artist list of releaseGroups with various groups.', () => {

  const GroupableResultsWithStateMgmt = withStateMgmt(GroupableResults)

  it('', () => {
    render(<GroupableResultsWithStateMgmt />)

    let typeHeaders = screen.getAllByRole('group')
    expect(typeHeaders).toHaveLength(7)
    let listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(20)

  })
})