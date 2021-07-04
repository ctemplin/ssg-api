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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [isSearching, setIsSearching] = useState(true)
  const [theData, setTheData] = useState({})
  const [curArtistId, setCurArtistId] = useState()
  const [curReleaseGroupId, setCurReleaseGroupId] = useState(null)
  const [curReleaseId, setCurReleaseId] = useState(null)
  const [coverArtId, setCoverArtId] = useState(null)
  const [imgUrlSmall, setImgUrlSmall] = useState()
  const [showLargeImg, setShowLargeImg] = useState(false)
  const [cookies, setCookie] = useCookies()

  useEffect(() => {
    setCookie("countries", ["US", "??"])
  },[])

  useEffect(() => {
    async function getData(){
      if (!curArtistId) return
      var url = new URL('https://musicbrainz.org/ws/2/artist/' + curArtistId)
      const params = new URLSearchParams()
      params.append("inc", "release-groups")
      url.search = params.toString()
      const resp = await fetch(
        url,
        {
          headers: {"Accept": "application/json"},
        }
      )
      const json = await resp.json()
      setTheData(
        {
          name: json.name,
          lsBegin: json['life-span']?.begin,
          lsEnd: json['life-span']?.end,
          releaseGroups:
            json['release-groups'].map(album => {
              return {
                id: album.id,
                title: album.title,
                firstReleaseDate: album['first-release-date']
              }
            })
        }
      )
    }
    getData()
  }
  ,[curArtistId])

  const handleSearchClick = () => {
    setCurArtistId(null)
    setCurReleaseGroupId(null)
    setCurReleaseId(null)
    setCoverArtId(null)
    setImgUrlSmall(null)
    setShowLargeImg(false)
    setIsSearching(true)
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
  }

  const handleReleaseSelect = (rid) => {
    setCurReleaseId(rid)
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

  return (
    <div className={styles.container}>
      <Head>
        <title>MusicBrainz Explorer</title>
        <meta name="description" content="Explorer for Artists, Albums and Songs from MusicBrainz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className={`columns ${styles.columnsContainer}`}>
          <div className={`column is-full`}>
          {!isSearching &&
            <>
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faArrowLeft}
              onClick={handleSearchClick}
            />
            <>&nbsp;</>
            <FontAwesomeIcon
              className={styles.icon}
              height="1em"
              icon={faSearch}
              onClick={handleSearchClick}
            />
            </>
          }
          </div>
        </div>
        {isSearching &&
          <>
          <div className={styles.artistSearchContainer}>
            <ArtistSearch handleArtistSearchClick={handleArtistSearchClick} />
            <Image src="/headphones.svg" className={styles.headphones} alt="" width={1000} height={1000} preload="true"/>
          </div>
          </>}
        <div className={`${styles.columnsContainer} columns`}>
          <div className={`column is-one-third`}>
            {!isSearching && <Artist {...theData} handleReleaseClick={handleReleaseGroupSelect}/>}
          </div>
          <div className={`column is-one-third`}>
            {curReleaseGroupId ?
            <ReleaseGroup id={curReleaseGroupId} handleReleaseClick={handleReleaseSelect}></ReleaseGroup>
            : <></>
            }
          </div>
          <div className={`column is-one-third`}>
            {curReleaseId ?
            <Release id={curReleaseId} imgUrlSmall={imgUrlSmall} handleCoverArt={handleCoverArt} handleCoverArtSmallClick={handleCoverArtClick}></Release>
            : <></>
            }
          </div>
        </div>

        {coverArtId ?
        <CoverArt id={coverArtId} handleCoverArtSmall={handleCoverArtSmall} handleCloseClick={hideLargeImg} showLargeImg={showLargeImg}></CoverArt>
        : <></>
        }

      {isSearching &&
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
