import { atom, selectorFamily } from 'recoil'
import * as data from '../data/youtube'
import { currentArtistAtom, currentRecordingAtom } from './musicbrainz'

export const youtubeVideoResults = atom({
  key: 'youtubeVideoResults',
  default: {
    etag: null,
    items: [],
    kind: null,
    nextPageToken: null,
    pageInfo: null,
    regionCode: null
  }
})

// Using SelectorFamily for consistency even though is is un-parametized
export const youtubeVideoSearch = selectorFamily({
  'key': 'youtubeSearch',
  get: () => async({get}) => {
    const rec = get(currentRecordingAtom)
    const artist = get(currentArtistAtom)
    const params = [['q', `${rec.title} ${artist.name}`]]
    return await data.youtubeVideoSearch(params) 
  }
})