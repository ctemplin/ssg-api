import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValueLoadable, useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
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
  const dispData = useRecoilValue(currentReleasePanelFormat)
  const setCurrentRelease = useSetRecoilState(currentReleaseAtom)
  const [currentRecording, setCurrentRecording] = useRecoilState(currentRecordingAtom)
  const [imgUrlSmall, setImgUrlSmall] = useState()
  const [showLargeImg, setShowLargeImg] = useState(false)

  const dataFetcher = useRecoilValueLoadable(releaseLookup(id))

  useEffect(() => {
    switch (dataFetcher.state) {
      case 'loading':
        break;
      case 'hasValue':
        setCurrentRelease(dataFetcher.contents)
        setIsLoading(false)
        setErrored(false)
        break;
      case 'hasError':
        console.log(dataFetcher.contents)
        setErrored(true)
      default:
        break;
    }
  },[id, dataFetcher.state])

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
        <div className={styles.blockHeaderDate}>{dispData.date}</div>
      )
    } else {
      return null
    }
  }

  useEffect(() => {
    head.current?.scrollIntoView({behavior: "smooth"})
  },[dispData.id])

  const handleClick = (id, title, i) => {
    return () => {
      setCurrentRecording({id: id, title: title, 'artist-credit': []})
    }
  }

  const head = useRef()

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
      <div className={`${styles.blockHeader} ${dispData.hasCoverArt && styles.blockHeaderArt}`}>
        <div>
          <div className={styles.blockHeaderTitle}>
            {dispData.title}
            <span className={styles.releaseCountry}>
              {dispData.country ? `(${dispData.country})` : ``}
            </span>
          </div>
          <ReleaseDate show={dispData.hasCoverArt} />
        </div>
        {dispData.hasCoverArt && imgUrlSmall ?
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
      <ReleaseDate show={!dispData.hasCoverArt} />
      </>
      }
    </div>
    {(!isLoading) && dispData.tracks ?
    <>
      <div className={styles.count}>Tracks: {dispData.tracks.length} found</div>
      <div className={styles.resultsList} ref={scrollableRef}>
        {dispData.tracks.map((_,i) =>
          <div
            key={_.id}
            onClick={handleClick(_.rid, _.title, i)}
            className={`
              ${styles.resultItem} 
              ${_.rid == currentRecording.id && styles.resultItemHl}
            `}
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
    {dispData?.id && dispData?.hasCoverArt &&
        <CoverArt id={dispData?.id}
          handleCoverArtSmall={handleCoverArtSmall}
          handleCloseClick={toggleImgModal} showLargeImg={showLargeImg} />
    }
  </div>
  )
}