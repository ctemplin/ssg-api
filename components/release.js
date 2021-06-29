import React,{useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-transition-group';
import Image from 'next/image'
import styles from '../styles/ResultBlock.module.scss'

export default function Release({id, handleCoverArt, imgUrlSmall, handleCoverArtSmallClick}) {
  
  const [isLoading, setIsLoading] = useState(true)
  const loadingTextBase = "Loading"
  const [loadingText, setLoadingText] = useState(loadingTextBase)
  const [theData, setTheData] = useState({})
  
  const handleClick = () => {
    
  }

  const formatLength = (ms) => {
    var mins = Math.floor(ms/60000)
    var secs = Math.floor((ms % 60000) / 1000)
    secs = secs.toString().padStart(2,'0')
    return `${mins}:${secs}`
  }
  
  useEffect(() => {
    setIsLoading(true)
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
      const date = new Date(
        json.date)
        .toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'}
        )
      setTheData(
        {
          id: id,
          title: json.title,
          date: date == "Invalid Date" ? null : date,
          hasCoverArt: json['cover-art-archive']?.artwork,
          tracks:
          json.media?.[0]?.tracks?.map(track => {
            return {
              id: track.id,
              title: track.title,
              position: track.position,
              length: formatLength(track['length']),
            }
          })
        }
      )
      setIsLoading(false)
    }
    setTimeout(getData, 300)
    const listDiv = scrollableRef.current
    if (listDiv) listDiv.scrollTop = 0
  },[id])

  useEffect(() => {
    if(theData.hasCoverArt) handleCoverArt(theData.id)
  },[theData, handleCoverArt])

  const scrollableRef = useRef()

  return (
  <div>
    <div className={`block`}>
      <div className={styles.blockType}>Recording</div>
        {isLoading ?
          <div className={styles.resultLoading}>{loadingText}</div>
        :
        <>
        <div className={`${styles.blockHeader} ${!imgUrlSmall ? 'level' : styles.blockHeaderArt}`}>
          <div>
            <div className={`is-size-4`}>{theData.title}</div>
            {imgUrlSmall ?
            <div className={`is-size-6`}>{theData.date ?? <>&nbsp;</>}</div>
            : <></>
            }
          </div>
          {theData.hasCoverArt && imgUrlSmall ?
          <a onClick={handleCoverArtSmallClick}><Image src={imgUrlSmall} width={100} height={100} layout="fixed" className={styles.resultHeaderImage} alt="Album Art Thumbnail"/></a>
          :
          <FontAwesomeIcon
            className={styles.resultHeaderIcon}
            height="1.3em"
            icon={faMusic}
            />
          }
        </div>
        {!imgUrlSmall ?
        <div className={`is-size-6`}>{theData.date ?? <>&nbsp;</>}</div>
        : <></>
        }
        
        </>
        }
    </div>
    {(!isLoading) && theData.tracks ?
      <>
      <div className={`is-size-7`}>Tracks: {theData.tracks.length} found</div>
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