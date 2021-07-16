import {useState, useEffect} from 'react'
import RecordingThumb from './recordingThumb'
import styles from '../styles/Recording.module.scss'

export default function Recording({id, releaseId, handleMaxClick, maxText}) {

  const [data, setData] = useState()
  const [ytData, setYtData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [errored, setErrored] = useState(false)

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
    }
    getData()
  },[id])

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
    <div className={styles.pseudoColumns}>
    <div className={styles.collapse} onClick={handleMaxClick}>{maxText}</div>
    {isLoading || errored ?
      <>
      {isLoading && <p>loading</p>}
      {errored && <p>An error occurred. Please try again later.</p>}
      </>
      :
      <div className={styles.container}>
        {data.title}
        {data["artist-credit"].map(_ => 
          <>
          {` -`}{_.joinphrase && <span>{` ${_.joinphase}`}</span>}<span>{` ${_.name}`}</span><br/>
          </>
        )}
        <div className={styles.resultItemList}>
        {ytData.items.map((_) => {
            return (
            <RecordingThumb key={_.id_videoId} videoId={_.id.videoId} title={_.snippet.title}
              imgSrc={_.snippet.thumbnails?.default.url}
              imgWidth={_.snippet.thumbnails?.default.width} 
              imgHeight={_.snippet.thumbnails?.default.height}
            />  
            )
        }
        )}
        </div>
      </div>
      }
    </div>
  )
}