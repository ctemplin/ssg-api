import React,{useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-transition-group';
import styles from '../styles/ResultBlock.module.scss'

export default function Release({id, handleCoverArt}) {
  
  const [isLoading, setIsLoading] = useState(true)
  const loadingTextBase = "Loading"
  const [loadingText, setLoadingText] = useState(loadingTextBase)
  const [theData, setTheData] = useState({})
  
  const handleClick = () => {
    
  }

  const getData = async () => {
    var url = new URL('https://musicbrainz.org/ws/2/release/' + id)
    const params = new URLSearchParams()
    params.append("inc", "recordings")
    url.search = params.toString()
    const resp = await fetch(
      url,
      {
        headers: {"Accept": "application/json"},
      }
    ) 
    const json = await resp.json()
    setTheData(
      {
        title: json.title,
        date: json.date,
        hasCoverArt: json['cover-art-archive']?.artwork,
        tracks:
        json.media?.[0]?.tracks?.map(track => {
          return {
            id: track.id,
            title: track.title,
            position: track.position,
            length: Math.floor(track['length']/60000)
            + ':'
            + Math.floor((track['length'] % 60000) / 1000).toString().padStart(2,'0'),
          }
        })
      }
    )
    
    clearInterval(loadingInterval)
    setIsLoading(false)
  }
  
  var loadingInterval
  useEffect(() => {
    setIsLoading(true)
    setTimeout(getData, 2000)
    const listDiv = scrollableRef.current
    if (listDiv) listDiv.scrollTop = 0
  },[id])

  useEffect(() => {
    if(theData.hasCoverArt) handleCoverArt(id)
  },[theData])

  const scrollableRef = useRef()

  return (
  <div>
    <div class="block">
      <div className={styles.blockType}>Recording</div>
        {isLoading ?
          <div className={styles.resultLoading}>{loadingText}</div>
        :
        <>
        <div className={`${styles.blockHeader} level`}>
          <span class="is-size-4">{theData.title}</span>
          <FontAwesomeIcon
            className={styles.resultHeaderIcon}
            height="1.3em"
            icon={faMusic}
            />
        </div>
        <div class="is-size-6">{theData.date ?? <>&nbsp;</>}</div>
        </>
        }
    </div>
    {(!isLoading) && theData.tracks ?
      <>
      <div class="is-size-7">Tracks: {theData.tracks.length} found</div>
      <div className={styles.rgpop} ref={scrollableRef}>
        {theData.tracks.map(_ => 
          <div onClick={handleClick(_.id)} key={_.id} className={styles.resultItem}>
            <span className={styles.trackPosition}>{`${_.position}. `}</span>
            <span className={styles.trackTitle}>{_.title}</span>
            <span className={styles.trackLength}>{_.length}</span>
          </div>
        )}
      </div>
      </>
    :
    <></>
    }
  </div>
  )
}