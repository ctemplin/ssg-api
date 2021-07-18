import {useState, useEffect} from 'react'
import RecordingArtistList from './recordingArtistList'
import YoutubeVideos from './youtubeVideos'
import styles from '../styles/Recording.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function Recording({id, handleMaxClick, isMaxed}) {

  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return 
    const getData = async () => {
      const url = new URL(`https://musicbrainz.org/ws/2/recording/${id}`)
      url.searchParams.append("inc", "artist-credits")
      const resp = await fetch(
        url,
        {headers: {"Accept": "application/json"}}
      )
      const json = await resp.json()
      setData(json)
      setIsLoading(false)
    }
    getData()
  },[id])

  return (
    <div className={styles.pseudoColumns}>
    <div className={styles.collapse} onClick={handleMaxClick}>
      <FontAwesomeIcon 
        icon={isMaxed ? faChevronDown : faChevronUp}
        className={styles.maxIcon}
      />
    </div>
      {!isLoading &&
      <div className={styles.container}>
        {data.title}{` - `}
        <RecordingArtistList data={data["artist-credit"]} />
        <YoutubeVideos songTitle={data.title} artistName={data["artist-credit"][0].name}/>
      </div>
      }
    </div>
  )
}