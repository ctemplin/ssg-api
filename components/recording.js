import {useState, useEffect} from 'react'
import RecordingThumb from './recordingThumb'
import styles from '../styles/Recording.module.scss'

export default function Recording({id, releaseId}) {

  const [data, setData] = useState()
  const [ytData, setYtData] = useState()
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
    }
    getData()
  },[id])

  useEffect(() => {
    const callTest = async () => {
      const params = new URLSearchParams()
      params.append('q', `${data.title} ${data["artist-credit"][0].name}`)
      const resp = await fetch(
        '/.netlify/functions/youtube-video-search?' + params.toString()
      )
      const json = await resp.json()
      setYtData(json)
      setIsLoading(false)
    }
    data?.title && callTest()
  },[data])

  return (
    <div>
    <div className={styles.collapse}>down</div>
    {isLoading ?
      <p>loading</p>
      :
      <div>
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