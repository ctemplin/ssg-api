const recoilExample = {
  body: `
  export const artistLookup = selectorFamily({
    'key': 'artistLookup',
    get: (id) => async({get}) => {
      if (!id) return get(currentArtistAtom)
      return await data.artistLookup(id)
    }
  })
  
  export const currentArtistAtom = atom({
    key: 'currentArtist',
    default: {
      id: null,
      name: null,
      lsBegin: null,
      lsEnd: null,
      releaseGroups: []
    }
  })
  
  export const currentArtistPanelFormat = selector({
    key: 'currentArtistPanelFormat',
    get: ({get}) => {
      const raw = get(currentArtistAtom)
      return ({
        ...raw,
        lsBegin: raw.lsBegin ? formatDate(raw.lsBegin) : '',
        lsEnd: raw.lsEnd ? formatDate(raw.lsEnd) : 'present'
      })
    }
  })
  
  export const currentArtistPanelFormatSorted = selectorFamily({
    key: 'currentArtistPanelFormatSorted',
    get: (sortBy = {column: null, dir:'asc'}) => ({get}) => {
      const sortRgs = (a,b) => {
        let ret
        switch (sortBy.column) {
          case 'firstReleaseDate':
            ret = sortDateStrings(a.firstReleaseDate, b.firstReleaseDate)
            break
          case 'title':
            ret = a.title == b.title ? 0 : a.title > b.title ? 1 : -1
            break
          default:
            ret = 0
        }
        return ret
      }
      const data = get(currentArtistPanelFormat)
      let _rgs = [...data.releaseGroups].sort(sortRgs)
  
      const _rgsGrouped = []
      if ((sortBy.column ?? 'default') == 'default') {
        const cats = new Set(_rgs.map(_ => (_.type1 ?? '') + (_.type2 ?? '')))
        Array.from(cats).sort().forEach(c => {
          _rgsGrouped.push(_rgs.filter(i => (i.type1 ?? '') + (i.type2 ?? '') == c))
        })
      }
  
      if (sortBy.dir == 'desc') { 
        _rgs.reverse() 
        _rgsGrouped.forEach(_ => _.reverse())
        _rgsGrouped.reverse()
      }
  
      return ({
        ...data,
        releaseGroups: _rgsGrouped.length ? _rgsGrouped : _rgs
      })
    }
  })
  
  export const currentArtistSlug = selector({
    key: 'currentArtistSlug',
    get: ({get}) => slugify(get(currentArtistAtom).name)
  })
  `
}

module.exports = { recoilExample }