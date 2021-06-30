import React,{useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ReactCSSTransitionGroup from 'react-transition-group';
import Image from 'next/image'
import styles from '../styles/ResultBlock.module.scss'

export default function Release({id, handleCoverArt, imgUrlSmall, handleCoverArtSmallClick}) {
  
  const [isLoading, setIsLoading] = useState(true)
  const [isImgLoading, setIsImgLoading] = useState(false)
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
    if(theData.hasCoverArt) {
      setIsImgLoading(true)
      handleCoverArt(theData.id)
    }
  },[theData, handleCoverArt])

  const scrollableRef = useRef()

  const renderDate = function() {
    return (
      <div className={`is-size-6 ${styles.blockHeaderDate}`}>{theData.date ?? <>&nbsp;</>}</div>
    )
  }

  const handleOnLoad = function() {
    setTimeout(() => setIsImgLoading(false), 500)
  }

  return (
  <div>
    <div className={`block`}>
      <div className={styles.blockType}>Recording</div>
        {isLoading ?
        <FontAwesomeIcon
          className={styles.resultBlockLoadingIcon}
          icon={faSpinner}
          pulse
        />
        :
        <>
        <div className={`${styles.blockHeader} ${!imgUrlSmall ? 'level' : styles.blockHeaderArt}`}>
          <div>
            <div className={`is-size-4 ${styles.blockHeaderTitle}`}>{theData.title}</div>
            {imgUrlSmall ?
            renderDate()
            : <></>
            }
          </div>
          {theData.hasCoverArt && imgUrlSmall ?
          <>
            <a onClick={handleCoverArtSmallClick} className={`${isImgLoading ? styles.smallCoverArtHidden : ''}`}>
              <Image src={imgUrlSmall} onLoad={handleOnLoad} width={100} height={100}
                layout="fixed" alt="Album Art Thumbnail"
                className={`${styles.resultHeaderImage}`}/>
            </a>
            {isImgLoading ?
            <div className={styles.smallCoverArtLoading}>
              <FontAwesomeIcon
                className={styles.resultBlockLoadingIcon}
                icon={faSpinner}
                pulse
              />
            </div>
            :
            <></>
            }
          </>
          :
          <FontAwesomeIcon
            className={styles.resultHeaderIcon}
            height="1.3em"
            icon={faMusic}
            />
          }
        </div>
        {!imgUrlSmall ?
        renderDate()
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