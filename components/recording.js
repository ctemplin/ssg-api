import { useEffect, useRef } from 'react'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import { recordingCredits } from '../models/musicbrainz'
import { youtubeVideoSearch, youtubeVideoResults } from '../models/youtube'
import RecordingArtistList from './recordingArtistList'
import YoutubeVideos from './youtubeVideos'
import styles from '../styles/Recording.module.scss'
import withMbz from './mbzComponent'

export default function Recording({dispData, isLoading=true}) {

  const YouTubeVideos_MB = withMbz(YoutubeVideos)
  const resetYoutube = useResetRecoilState(youtubeVideoResults)

  const credits = useRecoilValue(recordingCredits)

  useEffect(() => {
    resetYoutube()
    if (window.visualViewport?.width <= 768) {
      head.current?.scrollIntoView({behavior: "smooth"})
    }
  },[dispData.id, resetYoutube])

  const head = useRef()
  if (!dispData.id) return null
  return (
    <div className={styles.pseudoColumns} ref={head}>
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