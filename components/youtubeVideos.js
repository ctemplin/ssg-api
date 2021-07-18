import {useEffect, useState} from 'react'
import RecordingThumb from './recordingThumb'
import styles from '../styles/YoutubeVideos.module.scss'

export default function YoutubeVideos({data}) {
  
  const [ytData, setYtData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    const youTubeSearch = async () => {
      const params = new URLSearchParams()
      params.append('q', `${data.title} ${data["artist-credit"][0].name}`)
      const resp = await fetch(
        '/.netlify/functions/youtube-video-search?' + params.toString()
        )
        if (resp.status >= 200 && resp.status <= 299) {
          const json = await resp.json()
          setYtData(json)
          setIsLoading(false)
          setErrored(false)
        } else {
          setErrored(true)
          setIsLoading(false)
        }
      }
      data?.title && youTubeSearch()
    },[data])
    
    return (
      <>
      <p>Top YouTube videos:</p>
      {isLoading || errored ?
        <>
          {isLoading && <p>loading</p>}
          {errored && <p>An error occurred. Please try again later.</p>}
        </>
      :
        <div className={styles.resultItemList}>
        {ytData.items.map((_) => {
          return (
            <RecordingThumb key={_.id_videoId} videoId={_.id.videoId} title={_.snippet.title}
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