import { slugify, UPCASE } from '../lib/routes'
import { atom, selector, selectorFamily } from 'recoil';

// import { artistSearch, artistLookup } from '../data/musicbrainz'
import * as data from '../data/musicbrainz'

export const searchTermsAtom = atom({
  key: 'searchTerms',
  default: '',
})

export const searchResultsSel = selector({
  'key': 'searchResultsSel',
  get: async({get}) => {
    let searchTerms = get(searchTermsAtom)
    return searchTerms ? data.artistSearch(searchTerms) : {matches: null}
  }
})

export const searchScrollTopAtom = atom({
  key: 'searchScrollTop',
  default: 0
})

export const searchHlIndexAtom = atom({
  key: 'searchHlIndex',
  default: 0
})

export const trackMaxedAtom = atom({
  key: 'trackMaxed',
  default: false
})

export const artistLookup = selectorFamily({
  'key': 'searchLookup',
  get: (id) => async({get}) => {
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

export const currentArtistSlug = selector({
  key: 'currentArtistSlug',
  get: ({get}) => slugify(get(currentArtistAtom).name)
})

export const currentReleaseGroupAtom = atom({
  key: 'currentReleaseGroup',
  default: {
    id: null,
    title: null
  }
})

export const currentReleaseGroupSlug = selector({
  key: 'currentReleaseGroupSlug',
  get: ({get}) => slugify(get(currentReleaseGroupAtom).title)
})

export const currentReleaseAtom = atom({
  key: 'currentRelease',
  default: {
    id: null,
    title: null,
    date: null,
    country: null,
    hasCoverArt: false,
    tracks: []
  }
})

export const currentReleaseSlug = selector({
  key: 'currentReleaseSlug',
  get: ({get}) => {
    let release = get(currentReleaseAtom)
    return slugify([
      {text: release.title},
      {text: release.country, options: {transformer: UPCASE}},
      {text: release.date}
    ])
  }
})

export const currentRecordingAtom = atom({
  key: 'currentRecording',
  default: {
    id: null,
    'artist-credit': [],
    disambiguation: null,
    'first-release-date': null,
    length: null,
    title: null,
    video: null
  }
})

export const recordingCredits = selector({
  key: 'currentRecordingSel',
  get: ({get}) => {
    const rec = get(currentRecordingAtom)
    return rec['artist-credit'].map(_ => {
      return {id: _.artist.id, name: _.name, joinphrase: _.joinphrase}
    })
  }
})

export const currentRecordingSlug = selector({
  key: 'currentRecordingSlug',
  get: ({get}) => slugify(get(currentRecordingAtom).title)
})

export const breadcrumbsSel = selector({
  key: 'currentBreadcrumbs',
  get: ({get}) => {
    let bc = []
    let currentArtist = get(currentArtistAtom)
    if (currentArtist.id) {
      bc.push({id: currentArtist.id, label: currentArtist.name, slug: get(currentArtistSlug)})
      let currentReleaseGroup = get(currentReleaseGroupAtom)
      if (currentReleaseGroup.id) {
        bc.push({id: currentReleaseGroup.id, label: currentReleaseGroup.title, slug: get(currentReleaseGroupSlug)})
        let currentRelease = get(currentReleaseAtom)
        if (currentRelease.id) {
          bc.push({id: currentRelease.id, label: currentRelease.title, slug: get(currentReleaseSlug)})
          let currentRecording = get(currentRecordingAtom)
          if (currentRecording.id) {
            bc.push({id: currentRecording.id, label: currentRecording.title, slug: get(currentRecordingSlug)})
          }
        }
      }
    }
    return bc
  },
  set: ({get, set, reset}, {artistId, artistName} = {artistId: null, artistName: null}) => {
    // Jumping to a new artist from (e.g. from recording detail)
    // Store the current artist/release/etc. So user can jump back.
    if (artistId) {
      set(prevBreadcrumbsAtom, get(breadcrumbsSel))
      set(prevItems, {
        artist: get(currentArtistAtom),
        releaseGroup: get(currentReleaseGroupAtom),
        release: get(currentReleaseAtom),
        recording: get(currentRecordingAtom)
      })
      reset(currentRecordingAtom)
      reset(currentReleaseAtom)
      reset(currentReleaseGroupAtom)
      set(currentArtistAtom, {id: artistId, name: artistName})
    }
    // Jump back.
    else {
      reset(prevBreadcrumbsAtom)
      set(currentArtistAtom, get(prevItems).artist)
      set(currentReleaseGroupAtom, get(prevItems).releaseGroup)
      set(currentReleaseAtom, get(prevItems).release)
      set(currentRecordingAtom, get(prevItems).recording)
      reset(prevItems)
    }
  }
})

export const prevBreadcrumbsAtom = atom({
  key: 'prevBreadcrumbs',
  default: [{id: null, label: null, slug: null}]
})

export const prevItems = atom({
  key: 'prevItems',
  default: {artist: null, releaseGroup: null, release: null, recording: null}
})

export const dynamicPageTitle = selector({
  key: 'dynamicPageTitle',
  get: ({get}) => {
    const crumbs = 
    [
      get(currentArtistAtom).name,
      get(currentReleaseGroupAtom).title,
      get(currentReleaseAtom).title
    ]
    const str = crumbs.filter(_=>_).join(' - ').trim()
    let ret = 'MbEx - ' + str
    return ret
  }
})