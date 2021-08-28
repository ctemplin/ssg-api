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
         } from '../models/musicbrainz'
import {useRouter} from 'next/router'
import HeadTag from '../components/head'
import Link from 'next/link'
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
import { faKeyboard, faArrowLeft, faSearch,
         faMusic, faBrain, faMap } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  const currentArtist = useRecoilValue(currentArtistAtom)
  const resetArtist = useResetRecoilState(currentArtistAtom)
  const resetReleaseGroup = useResetRecoilState(currentReleaseGroupAtom)
  const resetRelease = useResetRecoilState(currentReleaseAtom)
  const resetRecording = useResetRecoilState(currentRecordingAtom)
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

  return (
    <div className={`${styles.container} ${currentArtist.aid ? '' : styles.searching}`}>
      <HeadTag />
      {qsIds.aid &&
      <RouterSync qsIds={qsIds} />
      }
      {currentArtist.id &&
        <div className={styles.columns} role="navigation">
          <div className={`${styles.column} ${styles.headColumn}`}>
            <a className={styles.toolbar} onClick={handleSearchClick}
               aria-label="Back to artist search" >
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faArrowLeft} />
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faSearch} />
            </a>
            <BreadcrumbsBack />
            <Link href="/about">
            <a className={styles.toolbar} >
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faMusic} />
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faBrain} />
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faMap} />
            </a>
            </Link>
          </div>
        </div>
      }
      {!currentArtist.id &&
        <>
        <div>{/* first grid row. reserved for header/menu */}</div>
        <div className={styles.artistSearchContainer} role="search">
          <ArtistSearch />
          <Image
            src="/headphones.svg" className={styles.headphones}
            layout="fill" preload="true" alt="headphones"
          />

        </div>
        </>}
      {currentArtist.id &&
        <>
        <div className={styles.columns} role="main">
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
        <div className={styles.trackDetails} role="main" aria-label="Track details">
          <Recording_MBZ
            lookup={recordingLookup}
            atom={currentRecordingAtom}
            dispSel={currentRecordingPanelFormat} />
        </div>
        </>
      }
      <footer className={styles.footer}>
        <FontAwesomeIcon
          className={styles.icon}
          height="1em"
          icon={faKeyboard}
        />
        <span>
          Made with NextJS and the MusicBrainz API. <Link href="/about">More...</Link>
        </span>
      </footer>
    </div>
  )
}
