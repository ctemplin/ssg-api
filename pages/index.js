import {useEffect} from 'react'
import {useRecoilValue} from 'recoil'
import {currentArtistAtom, trackMaxedAtom} from './_app'
import {useRouter} from 'next/router'
import {getPushArgs} from '../lib/routes'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import ArtistSearch from '../components/artistSearch'
import Artist from '../components/artist'
import ReleaseGroup from '../components/releaseGroup'
import Release from '../components/release'
import Recording from '../components/recording'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'


export default function Home({aid}) {
  const currentArtist = useRecoilValue(currentArtistAtom)
  const isTrackMaxed = useRecoilValue(trackMaxedAtom)
  const router = useRouter()

  useEffect(() => {
    let pushArgs = getPushArgs(router, [name], {aid: currentArtist.id, rgid: null, rid: null, tid: null})
    router.push.apply(this, pushArgs)
  }, [currentArtist.id])

  const handleSearchClick = () => {
    router.push("/", undefined, {shallow: true})
  }

  const handleReleaseGroupSelect = (rgid, name, title) => {
    let pushArgs = getPushArgs(router, [name, title], {rgid: rgid, rid: null, tid: null})
    router.replace.apply(this, pushArgs)
  }

  const handleReleaseSelect = (rid, name, rgTitle, title) => {
    let pushArgs = getPushArgs(router, [name, rgTitle, title], {rid: rid, tid: null})
    router.replace.apply(this, pushArgs)
  }
  
  const handleTrackSelect = (tid, name, rgTitle, rTitle, title) => {
    let pushArgs = getPushArgs(router, [name, rgTitle, rTitle, title], {tid: tid})
    router.replace.apply(this, pushArgs)
  }

  const containerClassNames = () => {
    let c = [styles.container]
    !router.query.aid && c.push(styles.searching)
    router.query.tid && c.push(styles.halved)
    isTrackMaxed && c.push(styles.maxed)
    return c.join(' ')
  }

  return (
    <div className={containerClassNames()}>
      <Head>
        <title>MusicBrainz Explorer</title>
        <meta name="description" content="Explorer for Artists, Albums and Songs from MusicBrainz" />
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
          <div className={styles.column}>
            <a onClick={handleSearchClick}>
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faArrowLeft}
            />
            <>&nbsp;</>
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faSearch}
            />
            </a>
          </div>
        </div>
      }
      {!router.query.aid &&
        <>
        <div>{/* first grid row. reserved for header/menu */}</div>
        <div className={styles.artistSearchContainer}>
          <ArtistSearch />
          <Image src="/headphones.svg" className={styles.headphones} alt="" layout="fill" preload="true"/>

        </div>
        </>}
      {currentArtist.id &&
        <>  
        <div className={styles.columns}>
          <div className={styles.column}>
            <Artist id={router.query.aid} handleReleaseGroupClick={handleReleaseGroupSelect}/>
          </div>
          <div className={styles.column}>
            {router.query.rgid &&
            <ReleaseGroup id={router.query.rgid} handleReleaseClick={handleReleaseSelect}></ReleaseGroup>
            }
          </div>
          <div className={styles.column}>
            {router.query.rid &&
            <Release id={router.query.rid} handleTrackClick={handleTrackSelect}>
            </Release>
            }
          </div>
        </div>
        {router.query.tid &&
        <Recording id={router.query.tid}></Recording>
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
