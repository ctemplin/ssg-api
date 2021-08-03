import {useCallback, useEffect, useMemo} from 'react'
import {useRecoilValue, useRecoilState, useSetRecoilState, useResetRecoilState} from 'recoil'
import {
         artistLookup, currentArtistAtom,
         currentArtistPanelFormat, currentArtistSlug,
         releaseGroupLookup, currentReleaseGroupAtom,
         currentReleaseGroupPanelFormat, currentReleaseGroupSlug,
         releaseLookup, currentReleaseAtom,
         currentReleasePanelFormat, currentReleaseSlug,
         recordingLookup, currentRecordingAtom,
         currentRecordingPanelFormat, currentRecordingSlug,
         trackMaxedAtom, dynamicPageTitle,
         userCountriesAtom,
         } from '../models/musicbrainz'
import {currentReleaseCoverArtAtom} from '../models/coverartartchive'
import {useCookies} from 'react-cookie'
import {useRouter} from 'next/router'
import {getRouterArgs} from '../lib/routes'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import ArtistSearch from '../components/artistSearch'
import BreadcrumbsBack from '../components/breadcrumbsBack'
import withMbz from '../components/mbzComponent'
import Artist from '../components/artist'
import ReleaseGroup from '../components/releaseGroup'
import Release from '../components/release'
import Recording from '../components/recording'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  const [currentArtist, setCurrentArtist] = useRecoilState(currentArtistAtom)
  const resetArtist = useResetRecoilState(currentArtistAtom)
  const artistSlug = useRecoilValue(currentArtistSlug)
  const [currentReleaseGroup, setCurrentReleaseGroup] = useRecoilState(currentReleaseGroupAtom)
  const resetReleaseGroup = useResetRecoilState(currentReleaseGroupAtom)
  const releaseGroupSlug = useRecoilValue(currentReleaseGroupSlug)
  const [currentRelease, setCurrentRelease] = useRecoilState(currentReleaseAtom)
  const resetRelease = useResetRecoilState(currentReleaseAtom)
  const releaseSlug = useRecoilValue(currentReleaseSlug)
  const [coverArt, setCoverArt] = useRecoilState(currentReleaseCoverArtAtom)
  const [currentRecording, setCurrentRecording] = useRecoilState(currentRecordingAtom)
  const resetRecording = useResetRecoilState(currentRecordingAtom)
  const recordingSlug = useRecoilValue(currentRecordingSlug)
  const isTrackMaxed = useRecoilValue(trackMaxedAtom)
  const derivedPageTitle = useRecoilValue(dynamicPageTitle)
  const setUserCountries = useSetRecoilState(userCountriesAtom)
  const [cookies,] = useCookies()
  const router = useRouter()

  // Wrapped components
  const Artist_MBZ = withMbz(Artist)
  const ReleaseGroup_MBZ = withMbz(ReleaseGroup)
  const Release_MBZ = withMbz(Release)
  const Recording_MBZ = withMbz(Recording)

  useEffect(() => {
    if (cookies.countries) {setUserCountries(new Set(cookies.countries))}
  },[cookies.countries, setUserCountries])

  // Rehydrate from pasted url
  useEffect(() => {
    if (!currentArtist.id && router?.query?.aid) {
      setCurrentArtist({...currentArtist, id: router.query.aid})
      if (!currentReleaseGroup.id && router?.query?.rgid) {
        setCurrentReleaseGroup({...currentReleaseGroup, id: router.query.rgid})
        if (!currentRelease.id && router?.query?.rid) {
          setCurrentRelease({...currentRelease, id: router.query.rid})
          setCoverArt({...coverArt, id: router.query.rid})
          if (!currentRecording.id && router?.query?.tid) {
            setCurrentRecording({...currentRecording, id: router.query.tid})
          }
        }
      }
    }
  }, [ router.query,
       currentArtist, currentReleaseGroup, currentRelease, currentRecording,
       setCurrentArtist, setCurrentReleaseGroup, setCurrentRelease, setCurrentRecording])

  const handleSearchClick = () => {
    resetArtist()
    resetRelease()
    resetReleaseGroup()
    resetRecording()
    router.push("/", undefined, {shallow: true})
  }

  /**
   * Sync the browser address bar (path and querystring) to reflect the
   * state of the current resources (artist, release group, release, recording).
   */
  useEffect(() => {
    const resources = [
      [currentArtist.id, 'aid', artistSlug],
      [currentReleaseGroup.id, 'rgid', releaseGroupSlug],
      [currentRelease.id, 'rid', releaseSlug],
      [currentRecording.id, 'tid', recordingSlug]
    ]
    let slugs = []
    const queryParams = {}
    // look thru resources in order (artist -> recording) for a discrepancy
    let wasChangeFound = !resources.every((resource, i, arr) => {
      if (resource[0] && resource[0] != router.query[resource[1]]) {
        // get all the slugs for resources up to and including this one
        arr.slice(0, i+1).forEach(s => {
          slugs.push(s[2])
          queryParams[s[1]] = s[0]
        })
        // break loop. additional path segments and params will be truncated
        return false;
      }
      return true; //continue loop
    })
    if (wasChangeFound) {
      let routerArgs = getRouterArgs(
        router, slugs, queryParams
      )
      // Replace url (no history update)
      router.replace.apply(this, routerArgs)
    }
  },
  [ router,
    currentArtist.id, currentReleaseGroup.id, currentRelease.id, currentRecording.id,
    artistSlug, releaseGroupSlug, releaseSlug, recordingSlug ]
  )

  const classNamesByRouteAndUi = (s, aid, tidNull, isMaxed) => {
    let c = [s.container]
    !aid && c.push(s.searching)
    !tidNull && c.push(s.halved)
    isMaxed && c.push(s.maxed)
    return c.join(' ')
  }

  const containerClassNames = useMemo(
    () =>
    classNamesByRouteAndUi(
       styles, currentArtist.id, (!router.query.tid), isTrackMaxed
    ),[currentArtist.id, router.query.tid, isTrackMaxed]
  )

  const titleByPath = useCallback((artistId, releaseGroupId) => {
    let title = "MusicBrainz Explorer"
    if (artistId == null && releaseGroupId == null)
      { title = "MusicBrainz Explorer - Search for your Sound" }
    else
      { title = derivedPageTitle }
    return title
  }, [derivedPageTitle])

  // Only update title if the artist or releaseGroup has changed
  // (or blanked for a new search)
  const pageTitle = useMemo(
    () => titleByPath(currentArtist.id, currentReleaseGroup.id),
    [titleByPath, currentArtist.id, currentReleaseGroup.id]
  )

  return (
    <div className={containerClassNames}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description"
          content="Explorer for Artists, Albums and Songs from MusicBrainz" />
        <link rel="icon" href="/favicon.ico" />
        <style>html,body {`{
          color: #4a4a4a;
          font-size: 1em;
          font-weight: 400;
          line-height: 1.5;
          height: 100% !important;
          overflow-y: overlay !important;
        }`}</style>
      </Head>
      {currentArtist.id &&
        <div className={styles.columns}>
          <div className={`${styles.column} ${styles.headColumn}`}>
            <a onClick={handleSearchClick} className={styles.toolbar}>
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faArrowLeft}
            />
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faSearch}
            />
            </a>
            <BreadcrumbsBack />
          </div>
        </div>
      }
      {!currentArtist.id &&
        <>
        <div>{/* first grid row. reserved for header/menu */}</div>
        <div className={styles.artistSearchContainer}>
          <ArtistSearch />
          <Image
            src="/headphones.svg" className={styles.headphones}
            alt="" layout="fill" preload="true"
          />

        </div>
        </>}
      {currentArtist.id &&
        <>
        <div className={styles.columns}>
          <div className={styles.column}>
            <Artist_MBZ
              lookup={artistLookup}
              atom={currentArtistAtom}
              dispSel={currentArtistPanelFormat} />
          </div>
          <div className={styles.column}>
            {currentReleaseGroup.id &&
            <ReleaseGroup_MBZ
              lookup={releaseGroupLookup}
              atom={currentReleaseGroupAtom}
              dispSel={currentReleaseGroupPanelFormat} />
            }
          </div>
          <div className={styles.column}>
            {currentRelease.id &&
            <Release_MBZ
              lookup={releaseLookup}
              atom={currentReleaseAtom}
              dispSel={currentReleasePanelFormat} />
            }
          </div>
        </div>
        {currentRecording.id &&
        <Recording_MBZ
          lookup={recordingLookup}
          atom={currentRecordingAtom}
          dispSel={currentRecordingPanelFormat} />
        }
        </>
      }
      <footer className={styles.footer}>
        <FontAwesomeIcon
          className={styles.icon}
          height="1em"
          icon={faKeyboard}
        />
        <span>
          Made with <a href="https://nextjs.org">NextJS</a> and the <a href="https://musicbrainz.org/doc/MusicBrainz_API">MusicBrainz API</a>
        </span>
      </footer>
    </div>
  )
}
