import { addS, addEs, addNothing } from '../../lib/plurals'

describe('Plurals library', () => {
  it('has no duplicate releaseGroup types', () => {
    let typeCount = addS.length + addEs.length + addNothing.length
    let uniqueTypes = new Set(addS.concat(addEs).concat(addNothing))
    expect(typeCount).toStrictEqual(uniqueTypes.size)
  })
})