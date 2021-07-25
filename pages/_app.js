import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
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

export const currentReleaseGroupAtom = atom({
  key: 'currentReleaseGroup',
  default: {
    id: null,
    title: null
  }
})

export const currentReleaseAtom = atom({
  key: 'currentRelease',
  default: {
    id: null,
    title: null,
    date: null,
    country: null,
    hasCoverArt: false,
    preslug: null,
    tracks: []
  }
})

export const breadcrumbsSel = selector({
  key: 'currentBreadcrumbs',
  get: ({get}) => {
    let bc = []
    let currentArtist = get(currentArtistAtom)
    if (currentArtist.id) {
      bc.push({id: currentArtist.id, name: currentArtist.name})
      let currentReleaseGroup = get(currentReleaseGroupAtom)
      if (currentReleaseGroup.id) {
        bc.push({id: currentReleaseGroup.id, title: currentReleaseGroup.title})
        if (currentReleaseAtom.id) {
          let currentRelease = get(currentReleaseAtom)
          bc.push({id: currentReleaseAtom.id, title: currentReleaseAtom.preslug})
        }
      }
    }
    return bc
  }
})

export const prevBreadcrumbsAtom = atom({
  key: 'prevBreadcrumbs',
  default: [{id: null, name: null}]
})

export const dynamicPageTitle = selector({
  key: 'dynamicPageTitle',
  get: ({get}) => {
    const crumbs = 
    [
      get(currentArtistAtom).name,
      get(currentReleaseGroupAtom).title,
      get(currentReleaseAtom).preslug
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
