import { atom, selector, selectorFamily } from 'recoil'
import * as data from '../data/coverartarchive'

export const currentReleaseCoverArtAtom = atom({
  key: 'currentReleaseCoverArt',
  default: {
    id: null,
    imgUrlSmall: null,
    imgUrlLarge: null
  }
})

export const coverArtLookup = selectorFamily({
  'key': 'coverArtLookup',
  get: (id) => async({get}) => {
    return id ? 
     await data.coverArtLookup(id) 
     : 
     get(currentReleaseCoverArtAtom)
  }
})