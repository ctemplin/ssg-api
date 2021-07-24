import React,{useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import CoverArt from '../components/coverArt'
import Image from 'next/image'
import styles from '../styles/ResultBlock.module.scss'
import formatDate from '../lib/dates'

export default function Release({id, handleTrackClick}) {

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({})
  const [hlRef, setHlRef] = useState()
  const [imgUrlSmall, setImgUrlSmall] = useState()
  const [showLargeImg, setShowLargeImg] = useState(false)

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
      const date = formatDate(json.date)
      setData(
        {
          id: id,
          title: json.title,
          date: date == "Invalid Date" ? null : date,
          country: json.country,
          hasCoverArt: json['cover-art-archive']?.artwork,
          tracks:
          json.media?.[0]?.tracks?.map(track => {
            return {
              id: track.id,
              rid: track.recording?.id,
              title: track.title,
              position: track.position,
              length: formatLength(track['length']),
            }
          })
        }
      )
      setIsLoading(false)
    }
    getData()
    const listDiv = scrollableRef.current
    if (listDiv) listDiv.scrollTop = 0
  },[id])

  const handleCoverArtSmall = (url) => {
    setImgUrlSmall(url)
  }

  const toggleImgModal = (e) => {
    setShowLargeImg(!showLargeImg)
  }

  const scrollableRef = useRef()

  const ReleaseDate = function({show}) {
    if (show) {
      return (
        <div className={styles.blockHeaderDate}>{data.date}</div>
      )
    } else {
      return null
    }
  }

  useEffect(() => {
    head.current?.scrollIntoView({behavior: "smooth"})
  },[data.id])

  const handleClick = (id, title, i) => {
    return () => {
      setHlRef(trackEls.current[i])
      handleTrackClick(id, null, null, null, title)
    }
  }

  const head = useRef()
  const trackEls = useRef([])

  return (
  <div ref={head} className={styles.block}>
    <div>
      <div className={styles.blockType}>Recording</div>
      {isLoading ?
      <FontAwesomeIcon
        className={styles.resultBlockLoadingIcon}
        icon={faSpinner}
        pulse
      />
      :
      <>
      <div className={`${styles.blockHeader} ${data.hasCoverArt && styles.blockHeaderArt}`}>
        <div>
          <div className={styles.blockHeaderTitle}>
            {data.title}
            <span className={styles.releaseCountry}>
              {data.country ? `(${data.country})` : ``}
            </span>
          </div>
          <ReleaseDate show={data.hasCoverArt} />
        </div>
        {data.hasCoverArt && imgUrlSmall ?
        <>
          <a onClick={toggleImgModal}>
            <Image
              src={imgUrlSmall.indexOf(id) > -1 ? imgUrlSmall : '/cover-art-placeholder.svg'}
              width={60} height={60}
              layout="fixed" alt="Album Art Thumbnail"
              className={styles.resultHeaderImage}/>
          </a>
        </>
        :
        <FontAwesomeIcon
          className={styles.resultHeaderIcon}
          height="1.3em"
          icon={faMusic}
          />
        }
      </div>
      <ReleaseDate show={!data.hasCoverArt} />
      </>
      }
    </div>
    {(!isLoading) && data.tracks ?
    <>
      <div className={styles.count}>Tracks: {data.tracks.length} found</div>
      <div className={styles.resultsList} ref={scrollableRef}>
        {data.tracks.map((_,i) =>
          <div
            onClick={handleClick(_.rid, _.title, i)}
            ref={(el) => trackEls.current[i] = el}
            key={_.id} className={styles.resultItem}
          >
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
    {data?.id && data?.hasCoverArt &&
        <CoverArt id={data?.id}
          handleCoverArtSmall={handleCoverArtSmall}
          handleCloseClick={toggleImgModal} showLargeImg={showLargeImg} />
    }
  </div>
  )
}