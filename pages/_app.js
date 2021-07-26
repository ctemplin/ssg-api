import { slugify, UPCASE } from '../lib/routes'

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

import '../styles/globals.scss'

export const searchTermsAtom = atom({
  key: 'searchTerms',
  default: '',
})

export const searchResultsAtom = atom({
  key: 'searchResults',
  default: {matches: null},
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
        if (currentReleaseAtom.id) {
          bc.push({id: currentReleaseAtom.id, label: currentReleaseAtom.title, slug: get(currentReleaseSlug)})
        }
      }
    }
    return bc
  }
})

export const prevBreadcrumbsAtom = atom({
  key: 'prevBreadcrumbs',
  default: [{id: null, label: null, slug: null}]
})

export const prevItems = atom({
  key: 'preItems',
  default: {artist: null, releaseGroup: null, release: null}
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

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
