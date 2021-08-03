import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { recordingCredits } from '../models/musicbrainz'
import { trackMaxedAtom } from '../models/musicbrainz'
import RecordingArtistList from './recordingArtistList'
import YoutubeVideos from './youtubeVideos'
import styles from '../styles/Recording.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function Recording({dispData, isLoading=true}) {

  const [isMaxed, setIsMaxed] = useRecoilState(trackMaxedAtom)
  const credits = useRecoilValue(recordingCredits)

  useEffect(() => {
    return () => {
      setIsMaxed(false)
    }
  },[setIsMaxed])

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
        {/* <YoutubeVideos songTitle={dispData.title} artistName={credits[0]?.name}/> */}
      </div>
      }
    </div>
  )
}