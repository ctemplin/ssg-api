import {useCallback, useEffect, useMemo} from 'react'
import {useRecoilValue, useRecoilState} from 'recoil'
import {
         currentArtistAtom, currentReleaseGroupAtom, currentReleaseAtom,
         trackMaxedAtom, dynamicPageTitle
} from './_app'
import {useRouter} from 'next/router'
import {getPushArgs} from '../lib/routes'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import ArtistSearch from '../components/artistSearch'
import BreadcrumbsBack from '../components/breadcrumbsBack'
import Artist from '../components/artist'
import ReleaseGroup from '../components/releaseGroup'
import Release from '../components/release'
import Recording from '../components/recording'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Home({aid}) {
  const [currentArtist, setCurrentArtist] = useRecoilState(currentArtistAtom)
  const [currentReleaseGroup, setCurrentReleaseGroup] = useRecoilState(currentReleaseGroupAtom)
  const [currentRelease, setCurrentRelease] = useRecoilState(currentReleaseAtom)
  const isTrackMaxed = useRecoilValue(trackMaxedAtom)
  const derivedPageTitle = useRecoilValue(dynamicPageTitle)
  const router = useRouter()

  useEffect(() => {
    if (currentArtist.id != router.query.aid) {
      setCurrentArtist({...currentArtist, id: router.query.aid})
    }
  }, [router.query])

  const handleSearchClick = () => {
    router.push("/", undefined, {shallow: true})
  }

  useEffect(() => {
    if (currentArtist.id && currentArtist.id != router.query.aid) {
      let pushArgs = getPushArgs(router, [currentArtist.name], {aid: currentArtist.id, rgid: null, rid: null, tid: null})
      router.push.apply(this, pushArgs)
    }
  }, [currentArtist.id])

  useEffect(() => {
    if (currentReleaseGroup.id && currentReleaseGroup.id != router.query.rgid) {
      let pushArgs = getPushArgs(
        router,
        [currentArtist.name, currentReleaseGroup.title],
        {rgid: currentReleaseGroup.id, rid: null, tid: null}
      )
      router.replace.apply(this, pushArgs)
    }
  }, [currentReleaseGroup.id])

  useEffect(() => {
    if (currentRelease.id && currentRelease.id != router.query.rgid) {
      let pushArgs = getPushArgs(
        router,
        [currentArtist.name, currentReleaseGroup.title, currentRelease.title],
        {rid: currentRelease.id,tid: null}
      )
      router.replace.apply(this, pushArgs)
    }
  }, [currentRelease.id])

  const handleTrackSelect = (tid, name, rgTitle, rTitle, title) => {
    let pushArgs = getPushArgs(router, [name, rgTitle, rTitle, title], {tid: tid})
    router.replace.apply(this, pushArgs)
  }

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
       styles, router.query.aid, (!router.query.tid), isTrackMaxed
    ),[styles, router.query.aid, (!router.query.tid), isTrackMaxed]
  )

  const titleByPath = (artistId, releaseGroupId) => {
    let title = "MusicBrainz Explorer"
    if (artistId == null && releaseGroupId == null) 
      { title = "MusicBrainz Explorer - Search for your Sound" }
    else 
      { title = derivedPageTitle }
    return title
  }

  // Only update title if the artist has changed (or blanked for a new search)
  const pageTitle = useMemo(
    () => titleByPath(currentArtist.id, currentReleaseGroup.id), [currentArtist.id, currentReleaseGroup.id]
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
      {router.query.aid &&
        <div className={styles.columns}>
          <div className={`${styles.column} ${styles.headColumn}`}>
            <a onClick={handleSearchClick}>
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
      {!router.query.aid &&
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
      {router.query.aid &&
        <>
        <div className={styles.columns}>
          <div className={styles.column}>
            <Artist id={router.query.aid} />
          </div>
          <div className={styles.column}>
            {router.query.rgid &&
            <ReleaseGroup id={router.query.rgid} />
            }
          </div>
          <div className={styles.column}>
            {router.query.rid &&
            <Release
              id={router.query.rid}
              handleTrackClick={handleTrackSelect}
            />
            }
          </div>
        </div>
        {router.query.tid &&
        <Recording id={router.query.tid} />
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
