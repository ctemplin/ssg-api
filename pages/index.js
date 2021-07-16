import React,{useState, useEffect, useCallback} from 'react'
import {useCookies} from 'react-cookie'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import ArtistSearch from '../components/artistSearch'
import Artist from '../components/artist'
import ReleaseGroup from '../components/releaseGroup'
import Release from '../components/release'
import CoverArt from '../components/coverArt'
import Recording from '../components/recording'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [isSearching, setIsSearching] = useState(true)
  const defaultSearchData = {matches: null}
  const [searchData, setSearchData] = useState(defaultSearchData)
  const [searchTerms, setSearchTerms] = useState('')
  const [searchHlIndex, setSearchHlIndex] = useState(-1)
  const [searchScroll, setSearchScroll] = useState(0)
  const [curArtistId, setCurArtistId] = useState()
  const [curReleaseGroupId, setCurReleaseGroupId] = useState(null)
  const [curReleaseId, setCurReleaseId] = useState(null)
  const [coverArtId, setCoverArtId] = useState(null)
  const [imgUrlSmall, setImgUrlSmall] = useState()
  const [showLargeImg, setShowLargeImg] = useState(false)
  const [curTrackId, setCurTrackId] = useState(null)
  const [trackMaxed, setTrackMaxed] = useState(false)
  const maxTexts = ['expand', 'collapse']
  const [maxText, setMaxText] = useState(maxTexts[0])

  const handleSearchClick = () => {
    setCurArtistId(null)
    setCurReleaseGroupId(null)
    setCurReleaseId(null)
    setCoverArtId(null)
    setImgUrlSmall(null)
    setShowLargeImg(false)
    setCurTrackId(null)
    setIsSearching(true)
    setTrackMaxed(false)
  }

  const handleArtistSearchClick = (id) => {
    setCurArtistId(id)
    setIsSearching(false)
  }

  const handleReleaseGroupSelect = (rgid) => {
    setCurReleaseGroupId(rgid)
    setCurReleaseId(null)
    setCoverArtId(null)
    setImgUrlSmall(null)
    setShowLargeImg(false)
    setCurTrackId(null)
  }

  const handleReleaseSelect = (rid) => {
    setCurReleaseId(rid)
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
    setMaxText(trackMaxed ? maxTexts[0] : maxTexts[1])
    setTrackMaxed(!trackMaxed)
  }

  const containerClassNames = () => {
    let c = [styles.container]
    isSearching && c.push(styles.searching)
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
        {!isSearching &&
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
        {isSearching &&
          <>
          <div>{/* first grid row. reserved for header/menu */}</div>
          <div className={styles.artistSearchContainer}>
            <ArtistSearch handleArtistSearchClick={handleArtistSearchClick} 
              defaultData={defaultSearchData}
              data={searchData} setData={setSearchData}
              searchTerms={searchTerms} setSearchTerms={setSearchTerms}
              scrollTop={searchScroll} setSearchScroll={setSearchScroll}
              hlIndex={searchHlIndex} setHlIndex={setSearchHlIndex}
            />
            <Image src="/headphones.svg" className={styles.headphones} alt="" layout="fill" preload="true"/>

          </div>
          </>}
        {!isSearching &&
        <>
        <div className={styles.columns}>
          <div className={styles.column}>
            <Artist id={curArtistId} handleReleaseClick={handleReleaseGroupSelect}/>
          </div>
          <div className={styles.column}>
            {curReleaseGroupId ?
            <ReleaseGroup id={curReleaseGroupId} handleReleaseClick={handleReleaseSelect}></ReleaseGroup>
            : <></>
            }
          </div>
          <div className={styles.column}>
            {curReleaseId ?
            <Release id={curReleaseId} imgUrlSmall={imgUrlSmall} handleCoverArt={handleCoverArt} 
              handleTrackClick={handleTrackSelect} handleCoverArtSmallClick={handleCoverArtClick}>
            </Release>
            : <></>
            }
          </div>
        </div>
        {curTrackId &&
        <Recording id={curTrackId} releaseId={curReleaseId} handleMaxClick={handleMaxClick} maxText={maxText}></Recording>
        }

        {coverArtId &&
        <CoverArt id={coverArtId} handleCoverArtSmall={handleCoverArtSmall} handleCloseClick={hideLargeImg} showLargeImg={showLargeImg}></CoverArt>
        }
        </>
        }

      {true &&
      <footer className={styles.footer}>
        <FontAwesomeIcon
          className={styles.icon}
          height="1em"
          icon={faKeyboard}
        />
        <span>
          Made with <a href="https://nextjs.org">NextJS</a> and the <a href="https://musicbrainz.org/doc/MusicBrainz_API">MusicBrainz API</a>
        </span>
      </footer>}
    </div>
  )
}
