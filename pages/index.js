import React,{useState, useEffect} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import ArtistSearch from '../components/artistSearch'
import Artist from '../components/artist'
import ReleaseGroup from '../components/releaseGroup'
import Release from '../components/release'
import CoverArt from '../components/coverArt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [isSearching, setIsSearching] = useState(true)
  const [theData, setTheData] = useState({})
  const [curArtistId, setCurArtistId] = useState()
  const [curReleaseGroupId, setCurReleaseGroupId] = useState(null)
  const [curReleaseId, setCurReleaseId] = useState(null)
  const [coverArtId, setCoverArtId] = useState(null)

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
  }

  const handleReleaseSelect = (rid) => {
    setCurReleaseId(rid)
  }

  const handleCoverArt = (caid) => {
    setCoverArtId(caid)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>MusicBrainz Explorer</title>
        <meta name="description" content="Explorer for Artists, Albums and Songs from MusicBrainz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className={`columns`}>
          <div className={`column is-one-third`}>
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
          <div className={`column`}></div><div className={`column`}></div>
        </div>
        {isSearching &&
          <> 
          <div className={`${styles.hero}`}>
            <Image src="/headphones.svg" alt="" layout="fill" preload="true"/>
            <ArtistSearch handleArtistSearchClick={handleArtistSearchClick} />
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
            {coverArtId ?
            <CoverArt id={coverArtId}></CoverArt>
            : <></>
            }
          </div>
          <div className={`column is-one-third`}>
            {curReleaseId ?
            <Release id={curReleaseId} handleCoverArt={handleCoverArt}></Release>
            : <></>
            }
          </div>
        </div>

      <footer className={styles.footer}>
        <FontAwesomeIcon
          className={styles.icon}
          height="1em"
          icon={faCopyright}
        />&nbsp;2021
          <span className={styles.logo}>
            
          </span>
      </footer>
    </div>
  )
}
