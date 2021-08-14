import {useEffect, useState, useMemo} from 'react'
import {useRecoilValue, useResetRecoilState} from 'recoil'
import {
         artistLookup, currentArtistAtom,
         currentArtistPanelFormatSorted,
         releaseGroupLookup, currentReleaseGroupAtom,
         currentReleaseGroupPanelFormat,
         releaseLookup, currentReleaseAtom,
         currentReleasePanelFormat,
         recordingLookup, currentRecordingAtom,
         currentRecordingPanelFormat,
         trackMaxedAtom,
         } from '../models/musicbrainz'
import {useRouter} from 'next/router'
import HeadTag from '../components/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import ArtistSearch from '../components/artistSearch'
import BreadcrumbsBack from '../components/breadcrumbsBack'
import RouterSync from '../components/routerSync'
import withMbz from '../components/mbzComponent'
import Artist from '../components/artist'
import ReleaseGroup from '../components/releaseGroup'
import Release from '../components/release'
import Recording from '../components/recording'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  const currentArtist = useRecoilValue(currentArtistAtom)
  const resetArtist = useResetRecoilState(currentArtistAtom)
  const resetReleaseGroup = useResetRecoilState(currentReleaseGroupAtom)
  const resetRelease = useResetRecoilState(currentReleaseAtom)
  const resetRecording = useResetRecoilState(currentRecordingAtom)
  const isTrackMaxed = useRecoilValue(trackMaxedAtom)
  const router = useRouter()

  // Wrapped components
  const Artist_MBZ = withMbz(Artist)
  const ReleaseGroup_MBZ = withMbz(ReleaseGroup)
  const Release_MBZ = withMbz(Release)
  const Recording_MBZ = withMbz(Recording)

  const [qsIds, setQsIds] = useState({})
  // If we have as query string parse, store it and remove it from address bar.
  useEffect(() => {
    if (document.location) {
      const qs = require('querystringify')
      const _qsIds = qs.parse(window.location.search)
      setQsIds(_qsIds)
      if (_qsIds.aid) router.replace('/', undefined, { shallow: true })
    }
  }, [])

  const handleSearchClick = () => {
    resetArtist()
    resetRelease()
    resetReleaseGroup()
    resetRecording()
    router.push("/", undefined, {shallow: true})
  }

  const classNamesByRouteAndUi = (s, aid, isMaxed) => {
    let c = [s.container]
    if (aid) c.push(isMaxed ? s.maxed : s.halved)
    else c.push(s.searching)
    return c.join(' ')
  }

  const containerClassNames = useMemo(
    () => classNamesByRouteAndUi(styles, currentArtist.id, isTrackMaxed),
    [currentArtist.id, isTrackMaxed]
  )

  return (
    <div className={containerClassNames}>
      <HeadTag />
      {qsIds.aid &&
      <RouterSync qsIds={qsIds} />
      }
      {currentArtist.id &&
        <div className={styles.columns}>
          <div className={`${styles.column} ${styles.headColumn}`}>
            <a className={styles.toolbar} onClick={handleSearchClick}
               aria-label="Back to artist search" >
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
            layout="fill" preload="true" alt="headphones"
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
              dispSel={currentArtistPanelFormatSorted}
              dispParams={{column: 'default', dir: 'asc'}} />
          </div>
          <div className={styles.column}>
            <ReleaseGroup_MBZ
              lookup={releaseGroupLookup}
              atom={currentReleaseGroupAtom}
              dispSel={currentReleaseGroupPanelFormat} />
          </div>
          <div className={styles.column}>
            <Release_MBZ
              lookup={releaseLookup}
              atom={currentReleaseAtom}
              dispSel={currentReleasePanelFormat} />
          </div>
        </div>
        <Recording_MBZ
          lookup={recordingLookup}
          atom={currentRecordingAtom}
          dispSel={currentRecordingPanelFormat} />
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
