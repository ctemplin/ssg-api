import { slugify, UPCASE } from '../lib/routes'
import { atom, selector, selectorFamily } from 'recoil'
import formatDate, { formatMilliseconds, sortDateStrings } from '../lib/dates'
import * as data from '../data/musicbrainz'
import { currentReleaseCoverArtAtom } from './coverartartchive'

/**
 * Create a new atom value with arbitrary initial props.
 * This allows callers to reset and atom with partial values
 * needed (prior to data access), without knowing/recreating all the other
 * default values.
 * IMPORTANT: assumes all values default to null except Arrays which
 * default to empty.
 * @param atomValue
 * @param newProps
 */
export function newDefaultsWithProps(atomValue, newProps) {
  let newDefaults = Object.fromEntries(Object.entries(atomValue).map(
    _ => [_[0], _[1] instanceof Array ? [] : null])
  )
  Object.assign(newDefaults, newProps)
  return newDefaults
}

// Used if no 'countries' cookie detected.
// TODO: detect user location and set appropriately.
function getDefaultCountries() {
  return new Set(['US', '??'])
}

export const userCountriesAtom = atom({
  key: 'userCountries',
  default: null
})

export const userCountriesOrDefault = selector({
  key: 'userCountriesOrDefault',
  set: ({set}, {countries} = {countries: []}) => {
    if (countries.length) {
      set(userCountriesAtom, countries instanceof Set ? countries : new Set(countries))
    } else {
      set(userCountriesAtom, getDefaultCountries())
    }
  }
})

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
    return ({
      ...data,
      releaseGroups: [...data.releaseGroups].sort(sortRgs)
    })
  }
})

export const currentArtistSlug = selector({
  key: 'currentArtistSlug',
  get: ({get}) => slugify(get(currentArtistAtom).name)
})

export const releaseGroupLookup = selectorFamily({
  'key': 'releaseGroupLookup',
  get: (id) => async({get}) => {
    if (!id) return get(currentReleaseGroupAtom)
    return await data.releaseGroupLookup(id)
  }
})

export const currentReleaseGroupAtom = atom({
  key: 'currentReleaseGroup',
  default: {
    id: null,
    title: null,
    firstReleaseDate: null,
    releases: []
  }
})

export const currentReleaseGroupPanelFormat = selector({
  key: 'currentReleaseGroupPanelFormat',
  get: ({get}) => {
    const raw = get(currentReleaseGroupAtom)
    return ({
      ...raw,
      firstReleaseDate: formatDate(raw.firstReleaseDate) || null
    })
  }
})

export const releaseGroupCountries = selector({
  key: 'releaseGroupCountries',
  get: ({get}) => {
    const _countries = new Set()
    const rg = get(currentReleaseGroupAtom)
    rg.releases.map(
      release => _countries.add(release.country || "??")
    )
    return _countries
  }
})

export const releaseGroupUserCountryMatch = selector({
  key: 'releaseGroupUserCountryMatch',
  get: ({get}) => {
    const userCountries = get(userCountriesAtom)
    const rgCountries = Array.from(get(releaseGroupCountries))
    let _anyCountryMatch = rgCountries.some(
      _ => userCountries.has(_)
    )
    return _anyCountryMatch
  }
})

export const releaseGroupFilteredReleases = selectorFamily({
  key: 'releaseGroupFilteredReleases',
  get: (anyCountryMatch) => ({get}) => {
    const countryFilter = anyCountryMatch ?
    (_,i,a) => a.length == 1 || get(userCountriesAtom).has(_.country)
    :
    (_,i,a) => true

    return get(currentReleaseGroupAtom).releases?.filter(countryFilter)
  }
})

export const currentReleaseGroupSlug = selector({
  key: 'currentReleaseGroupSlug',
  get: ({get}) => slugify(get(currentReleaseGroupAtom).title)
})

export const releaseLookup = selectorFamily({
  'key': 'releaseLookup',
  get: (id) => async({get}) => {
    if (!id) return get(currentReleaseAtom)
    return await data.releaseLookup(id)
  }
})

export const currentReleaseAtom = atom({
  key: 'currentRelease',
  default: {
    id: null,
    title: null,
    date: null,
    country: null,
    hasCoverArt: null,
    tracks: []
  }
})

export const currentReleasePanelFormat = selector({
  key: 'currentReleasePanelFormat',
  get: ({get}) => {
    const raw = get(currentReleaseAtom)
    return ({
      ...raw,
      date: formatDate(raw.date),
      tracks: raw.tracks.map(_=> ({..._, length: formatMilliseconds(_.length)}))
    })
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

export const recordingLookup = selectorFamily({
  key: 'recordingLookeup',
  get: (id) => async ({get}) => {
    if (!id) return get(currentRecordingAtom)
    return await data.recordingLookup(id)
  }
})

export const currentRecordingAtom = atom({
  key: 'currentRecording',
  default: {
    id: null,
    artistCredits: [],
    disambiguation: null,
    firstReleaseDate: null,
    length: null,
    title: null,
    video: null
  }
})

export const currentRecordingPanelFormat = selector({
  key: 'currentRecordingPanelFormat',
  get: ({get}) => {
    const raw = get(currentRecordingAtom)
    return ({
      id: raw.id,
      title: raw.title
    })
  }
})

export const recordingCredits = selector({
  key: 'recordingCredits',
  get: ({get}) => {
    const rec = get(currentRecordingAtom)
    return rec.artistCredits.map(_ => {
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
      set(
        currentArtistAtom, 
        newDefaultsWithProps(
          get(currentArtistAtom),
          {id: artistId, name: artistName}
        )
      )
    }
    // Jump back.
    else {
      reset(prevBreadcrumbsAtom)
      set(currentArtistAtom, get(prevItems).artist)
      set(currentReleaseGroupAtom, get(prevItems).releaseGroup)
      let prevRelease = get(prevItems).release
      set(currentReleaseAtom, prevRelease)
      set(currentReleaseCoverArtAtom, {id: prevRelease.id})
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
    ]
    const str = crumbs.filter(_=>_).join(' - ').trim()
    let ret = ""
    if (str.length)
      ret = 'MbEx - ' + str
    else
      ret = "MusicBrainz Explorer - Search for your Sound"
    return ret
  }
})