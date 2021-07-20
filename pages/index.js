import React,{useState, useCallback} from 'react'
import {useRouter} from 'next/router'
import {getPushArgs} from '../lib/routes'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import {ArtistContext} from '../components/artistContext'
import ArtistSearch from '../components/artistSearch'
import Artist from '../components/artist'
import ReleaseGroup from '../components/releaseGroup'
import Release from '../components/release'
import CoverArt from '../components/coverArt'
import Recording from '../components/recording'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'


export default function Home({aid}) {
  const defaultSearchData = {matches: null}
  const [searchData, setSearchData] = useState(defaultSearchData)
  const [searchTerms, setSearchTerms] = useState('')
  const [searchHlIndex, setSearchHlIndex] = useState(-1)
  const [searchScroll, setSearchScroll] = useState(0)
  const [coverArtId, setCoverArtId] = useState(null)
  const [imgUrlSmall, setImgUrlSmall] = useState()
  const [showLargeImg, setShowLargeImg] = useState(false)
  const [curTrackId, setCurTrackId] = useState(null)
  const [trackMaxed, setTrackMaxed] = useState(false)

  const router = useRouter()

  const handleArtistSearchClick = (id, name) => {
    let pushArgs = getPushArgs(router, [name], {aid: id, rgid:null, rid: null})
    router.push.apply(this, pushArgs)
    setCoverArtId(null)
    setImgUrlSmall(null)
    setShowLargeImg(false)
    setCurTrackId(null)
    setTrackMaxed(false)
  }

  const handleSearchClick = () => {
    router.push("/", undefined, {shallow: true})
    setCoverArtId(null)
    setImgUrlSmall(null)
    setShowLargeImg(false)
    setCurTrackId(null)
    setTrackMaxed(false)
  }

  const handleReleaseGroupSelect = (rgid, name, title) => {
    let pushArgs = getPushArgs(router, [name, title], {rgid: rgid, rid: null})
    router.push.apply(this, pushArgs)
    setCoverArtId(null)
    setImgUrlSmall(null)
    setShowLargeImg(false)
    setCurTrackId(null)
  }

  const handleReleaseSelect = (rid, name, rgTitle, title) => {
    let pushArgs = getPushArgs(router, [name, rgTitle, title], {rid: rid})
    router.push.apply(this, pushArgs)
    setCurTrackId(null)
  }

  const handleCoverArt = useCallback((caid) => {
    setCoverArtId(caid)
  },[])

  const handleCoverArtSmall = useCallback((url) => {
    setImgUrlSmall(url)
  },[])

  const handleCoverArtClick = (e) => {
    setShowLargeImg(true)
  }

  const hideLargeImg = (e) => {
    setShowLargeImg(false)
  }

  const handleTrackSelect = (tid) => {
    setCurTrackId(tid)
  }

  const handleMaxClick = () => {
    setTrackMaxed(!trackMaxed)
  }

  const containerClassNames = () => {
    let c = [styles.container]
    !router.query.aid && c.push(styles.searching)
    curTrackId && c.push(styles.halved)
    trackMaxed && c.push(styles.maxed)
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
          <ArtistSearch
            defaultData={defaultSearchData}
            handleArtistSearchClick={handleArtistSearchClick}
            data={searchData} setData={setSearchData}
            searchTerms={searchTerms} setSearchTerms={setSearchTerms}
            scrollTop={searchScroll} setSearchScroll={setSearchScroll}
            hlIndex={searchHlIndex} setHlIndex={setSearchHlIndex}
          />
          <Image src="/headphones.svg" className={styles.headphones} alt="" layout="fill" preload="true"/>

        </div>
        </>}
      {router.query.aid &&
        <>  
        <div className={styles.columns}>
          <div className={styles.column}>
            <Artist id={router.query.aid} handleReleaseGroupClick={handleReleaseGroupSelect}/>
          </div>
          <div className={styles.column}>
            {router.query.rgid ?
            <ReleaseGroup id={router.query.rgid} handleReleaseClick={handleReleaseSelect}></ReleaseGroup>
            : <></>
            }
          </div>
          <div className={styles.column}>
            {router.query.rid ?
            <Release id={router.query.rid} imgUrlSmall={imgUrlSmall} handleCoverArt={handleCoverArt}
              handleTrackClick={handleTrackSelect} handleCoverArtSmallClick={handleCoverArtClick}>
            </Release>
            : <></>
            }
          </div>
        </div>
        {curTrackId &&
        <ArtistContext.Provider value={{id: router.query.aid, handleClick: handleArtistSearchClick}}>
          <Recording id={curTrackId} handleMaxClick={handleMaxClick} isMaxed={trackMaxed}></Recording>
        </ArtistContext.Provider>
        }
        {coverArtId &&
        <CoverArt id={coverArtId} handleCoverArtSmall={handleCoverArtSmall} handleCloseClick={hideLargeImg} showLargeImg={showLargeImg}></CoverArt>
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
