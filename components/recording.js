import {useState, useEffect} from 'react'
import {useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState} from 'recoil'
import {recordingLookup, currentRecordingAtom, currentRecordingPanelFormat} from '../models/musicbrainz'
import {recordingCredits} from '../models/musicbrainz'
import {trackMaxedAtom} from '../models/musicbrainz'
import RecordingArtistList from './recordingArtistList'
import YoutubeVideos from './youtubeVideos'
import styles from '../styles/Recording.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function Recording({id}) {

  const [isLoading, setIsLoading] = useState(true)
  const [isMaxed, setIsMaxed] = useRecoilState(trackMaxedAtom)
  const dispData = useRecoilValue(currentRecordingPanelFormat)
  const setCurrentRecording = useSetRecoilState(currentRecordingAtom)
  const credits = useRecoilValue(recordingCredits)
  const dataFetcher = useRecoilValueLoadable(recordingLookup(id))

  useEffect(() => {
    switch (dataFetcher.state) {
      case 'loading':
        break;
      case 'hasValue':
        setCurrentRecording(dataFetcher.contents)
        setIsLoading(false)
        break;
      case 'hasError':
        setIsLoading(false)
        console.log(dataFetcher.contents)
        break;
      default:
        break;
    }
  }, [id, dataFetcher.state])

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
        {dispData.title}{` - `}
        <RecordingArtistList credits={credits}/>
      </div>
      }
    </div>
  )
}