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

export const breadcrumbsSel = selector({
  key: 'currentBreadcrumbs',
  get: ({get}) => {
    let bc = []
    let currentArtist = get(currentArtistAtom)
    if (currentArtist.id) {
      bc.push({id: currentArtist.id, name: currentArtist.name})
      // TODO: add releaseGroup as nested ifs, etc...
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
    let ret = 'MbEx - ' + get(currentArtistAtom).name
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
