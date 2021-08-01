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
import {useCookies} from 'react-cookie'
import {useRouter} from 'next/router'
import {getPushArgs} from '../lib/routes'
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
  const currentReleaseGroup = useRecoilValue(currentReleaseGroupAtom)
  const resetReleaseGroup = useResetRecoilState(currentReleaseGroupAtom)
  const releaseGroupSlug = useRecoilValue(currentReleaseGroupSlug)
  const currentRelease = useRecoilValue(currentReleaseAtom)
  const resetRelease = useResetRecoilState(currentReleaseAtom)
  const releaseSlug = useRecoilValue(currentReleaseSlug)
  const currentRecording = useRecoilValue(currentRecordingAtom)
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

  useEffect(() => {
    if (!currentArtist.id && router?.query?.aid) {
      setCurrentArtist({...currentArtist, id: router.query.aid})
    }
  }, [router.query.aid, currentArtist, setCurrentArtist])

  const handleSearchClick = () => {
    resetArtist()
    resetRelease()
    resetReleaseGroup()
    resetRecording()
    router.push("/", undefined, {shallow: true})
  }

  useEffect(() => {
    if (currentArtist.id && currentArtist.id != router.query.aid) {
      let pushArgs = getPushArgs(router, [artistSlug], {aid: currentArtist.id, rgid: null, rid: null, tid: null})
      router.push.apply(this, pushArgs)
    }
  }, [router, currentArtist.id, artistSlug])

  useEffect(() => {
    if (currentReleaseGroup.id && currentReleaseGroup.id != router.query.rgid) {
      let pushArgs = getPushArgs(
        router,
        [artistSlug, releaseGroupSlug],
        {rgid: currentReleaseGroup.id, rid: null, tid: null}
      )
      router.replace.apply(this, pushArgs)
    }
    resetRecording()
    resetRelease()
  }, [router, currentReleaseGroup.id,
      artistSlug, releaseGroupSlug,
      resetRelease, resetRecording])

  useEffect(() => {
    if (currentRelease.id && currentRelease.id != router.query.rid) {
      let pushArgs = getPushArgs(
        router,
        [artistSlug, releaseGroupSlug, releaseSlug],
        {rid: currentRelease.id, tid: null}
      )
      router.replace.apply(this, pushArgs)
    }
  }, [router, currentRelease.id,
      artistSlug, releaseGroupSlug, releaseSlug,
      resetRecording])

  useEffect(() => {
    if (currentRecording.id && currentRecording.id != router.query.tid) {
      let pushArgs = getPushArgs(
        router,
        [artistSlug, releaseGroupSlug, releaseSlug, recordingSlug], 
        {tid: currentRecording.id}
      )
      router.replace.apply(this, pushArgs)
    }
  }, [router, currentRecording.id,
      artistSlug, releaseGroupSlug, releaseSlug, recordingSlug])

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
