import {useState, useEffect} from 'react'
import {useRecoilState} from 'recoil'
import {currentRecordingAtom} from '../pages/_app'
import {trackMaxedAtom} from '../pages/_app'
import RecordingArtistList from './recordingArtistList'
import YoutubeVideos from './youtubeVideos'
import styles from '../styles/Recording.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function Recording({id}) {

  const [data, setData] = useRecoilState(currentRecordingAtom)
  const [isLoading, setIsLoading] = useState(true)
  const [isMaxed, setIsMaxed] = useRecoilState(trackMaxedAtom)

  useEffect(() => {
    setIsLoading(true)
    if (!id) return
    const getData = async () => {
      const url = new URL(`https://musicbrainz.org/ws/2/recording/${id}`)
      url.searchParams.append("inc", "artist-credits")
      const resp = await fetch(
        url,
        {headers: {"Accept": "application/json"}}
      )
      const json = await resp.json()
      setData({...data, ...json})
      setIsLoading(false)
    }
    getData()
  },[id])

  useEffect(() => {
    return () => {
      setIsMaxed(false)
    }
  },[])

  return (
    <div className={styles.pseudoColumns}>
    <div className={styles.collapse} onClick={() => setIsMaxed(!isMaxed)}>
      <FontAwesomeIcon
        icon={isMaxed ? faChevronDown : faChevronUp}
        className={styles.maxIcon}
      />
    </div>
      {!isLoading &&
      <div className={styles.container}>
        {data.title}{` - `}
        <RecordingArtistList data={data['artist-credit']} />
      </div>
      }
    </div>
  )
}