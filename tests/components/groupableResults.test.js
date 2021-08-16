import { render } from '@/lib/testUtils'
import { screen } from '@testing-library/dom'
import GroupableResults from '../../components/groupableResults'
import withStateMgmt from './withStateMgmt'

describe('Renders artist list of releaseGroups with various groups.', () => {

  const GroupableResultsWithStateMgmt = withStateMgmt(GroupableResults)

  it('', () => {
    render(<GroupableResultsWithStateMgmt />)

    let typeHeaders = screen.getAllByRole('group')
    expect(typeHeaders).toHaveLength(7)
    let listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(20)

    expect(listItems[0]).toHaveTextContent("Blacklisted")
    expect(listItems[6]).toHaveTextContent("Truckdriver Gladiator Mule")
  })
})