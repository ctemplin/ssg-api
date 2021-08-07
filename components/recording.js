import { useEffect } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { recordingCredits } from '../models/musicbrainz'
import { trackMaxedAtom } from '../models/musicbrainz'
import { youtubeVideoSearch, youtubeVideoResults } from '../models/youtube'
import RecordingArtistList from './recordingArtistList'
import YoutubeVideos from './youtubeVideos'
import styles from '../styles/Recording.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import withMbz from './mbzComponent'

export default function Recording({dispData, isLoading=true}) {

  const YouTubeVideos_MB = withMbz(YoutubeVideos)
  const resetYoutube = useResetRecoilState(youtubeVideoResults)

  const [isMaxed, setIsMaxed] = useRecoilState(trackMaxedAtom)
  const credits = useRecoilValue(recordingCredits)

  useEffect(() => {
    return () => {
      setIsMaxed(false)
    }
  },[setIsMaxed])

  useEffect(() => {
    resetYoutube()
  },[dispData.id])

  if (!dispData.id) return null
  return (
    <div className={styles.pseudoColumns}>
    <div className={styles.collapse} onClick={() => setIsMaxed(!isMaxed)}>
      <FontAwesomeIcon
        icon={isMaxed ? faChevronDown : faChevronUp}
        className={styles.maxIcon}
      />
    </div>
      {!isLoading && dispData.id &&
      <div className={styles.container}>
        {dispData.title}{` - `}
        <RecordingArtistList credits={credits}/>
        <YouTubeVideos_MB
          lookup={youtubeVideoSearch}
          atom={youtubeVideoResults}
          dispSel={youtubeVideoResults}
        />
      </div>
      }
    </div>
  )
}