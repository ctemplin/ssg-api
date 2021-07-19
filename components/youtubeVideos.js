import {useEffect, useState} from 'react'
import RecordingThumb from './recordingThumb'
import NetworkError from './networkError'
import styles from '../styles/YoutubeVideos.module.scss'

export default function YoutubeVideos({songTitle, artistName}) {

  const [ytData, setYtData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    const youTubeSearch = async () => {
      const params = new URLSearchParams()
      params.append('q', `${songTitle} ${artistName}`)
      const resp = await fetch(
        '/.netlify/functions/youtube-video-search?' + params.toString()
        )
        if (resp.status >= 200 && resp.status <= 299) {
          const json = await resp.json()
          setYtData(json)
          setErrored(false)
          setIsLoading(false)
        } else {
          setErrored(true)
          setIsLoading(false)
        }
      }
    if(songTitle) youTubeSearch()
  },[songTitle])

    return (
      <>
      <p>YouTube:</p>
      {isLoading || errored &&
        <>
          {isLoading && <p>loading</p>}
          {errored &&
          <NetworkError errorMsg="A network error occurred. Please try again later." style={{'flex-direction': 'row'}} />
          }
        </>
      }
      {!isLoading && !errored &&
        <div className={styles.resultItemList}>
        {ytData.items.map((_) => {
          return (
            <RecordingThumb key={_.id.videoId} videoId={_.id.videoId} title={_.snippet.title}
            imgSrc={_.snippet.thumbnails?.default.url}
            imgWidth={_.snippet.thumbnails?.default.width}
            imgHeight={_.snippet.thumbnails?.default.height}
            />
          )
        })}
        </div>
      }
      </>
    )
}