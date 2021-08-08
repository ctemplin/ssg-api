import { atom, selector, selectorFamily } from 'recoil'
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

const youtubeQueryString = selector({
  'key': 'youtubeQueryString',
  get: ({get}) => {
    const rec = get(currentRecordingAtom)
    const artist = get(currentArtistAtom)
    if (!rec.id) return null
    return `${rec.title} ${artist.name}`
  }
})

// Using SelectorFamily for consistency even though is is un-parametized.
// Using selector above for querystring to leverage caching. Directly getting
// resource atoms would make the dependencies too granular.
export const youtubeVideoSearch = selectorFamily({
  'key': 'youtubeSearch',
  get: () => async({get}) => {
    const qs = get(youtubeQueryString)
    if (!qs) return get(youtubeVideoResults)
    const params = [['q', qs]]
    return await data.youtubeVideoSearch(params)
  }
})