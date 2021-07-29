import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValueLoadable, useRecoilValue, useSetRecoilState } from 'recoil'
import { releaseLookup, currentReleaseAtom, currentReleasePanelFormat, currentRecordingAtom } from '../models/musicbrainz'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import CoverArt from '../components/coverArt'
import Image from 'next/image'
import styles from '../styles/ResultBlock.module.scss'

export default function Release({id}) {

  const [isLoading, setIsLoading] = useState(true)
  const [errored, setErrored] = useState(false)
  const data = useRecoilValue(currentReleasePanelFormat)
  const setCurrentRelease = useSetRecoilState(currentReleaseAtom)
  const setCurrentRecording = useSetRecoilState(currentRecordingAtom)
  const [hlRef, setHlRef] = useState()
  const [imgUrlSmall, setImgUrlSmall] = useState()
  const [showLargeImg, setShowLargeImg] = useState(false)

  const fetchData = useRecoilValueLoadable(releaseLookup(id))

  useEffect(() => {
    switch (fetchData.state) {
      case 'loading':
        break;
      case 'hasValue':
        setCurrentRelease(fetchData.contents)
        setIsLoading(false)
        setErrored(false)
        break;
      case 'hasError':
        console.log(fetchData.contents)
        setErrored(true)
      default:
        break;
    }
  },[fetchData.state])

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
      setCurrentRecording({id: id, title: title, 'artist-credit': []})
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