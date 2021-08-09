import React, { useEffect, useRef } from 'react'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import { currentRecordingAtom, resetThenSetValue } from '../models/musicbrainz'
import { currentReleaseCoverArtAtom, coverArtLookup } from '../models/coverartartchive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import withMbz from '../components/mbzComponent'
import CoverArtThumbnail from './coverArtThumbnail'
import styles from '../styles/ResultBlock.module.scss'

export default function Release({dispData}) {

  const [currentRecording, setCurrentRecording] = useRecoilState(currentRecordingAtom)
  const resetRecording = useResetRecoilState(currentRecordingAtom)
  const resetCoverArt = useResetRecoilState(currentReleaseCoverArtAtom)
  const resetThenSet = useSetRecoilState(resetThenSetValue)
  const [, setCoverArt] = useRecoilState(currentReleaseCoverArtAtom)

  const CoverArtThumbnail_MBZ = withMbz(CoverArtThumbnail)

  useEffect(() => {
      setCoverArt({id: dispData.id})
      resetRecording()
  },[dispData.id, setCoverArt, resetRecording])

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

  const handleClick = (id, title) => {
    return () => resetThenSet({atom: currentRecordingAtom, id: id, title: title})
  }

  const head = useRef()

  if (!dispData.id) { return null }
  return (
  <div ref={head} className={styles.block}>
    <div>
      <div className={styles.blockType}>Recording</div>
      {!dispData.title ?
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
            {/* Title & country-span on 1 line for proper spacing/wrapping */}
            {dispData.title} <span className={styles.releaseCountry}>
            {dispData.country ? `(${dispData.country})` : ``}</span>
          </div>
          <ReleaseDate show={dispData.hasCoverArt} />
        </div>
        {dispData.hasCoverArt != null &&
          <>
          {dispData.hasCoverArt ?
            <CoverArtThumbnail_MBZ
              lookup={coverArtLookup}
              atom={currentReleaseCoverArtAtom}
              dispSel={currentReleaseCoverArtAtom}
            />
          :
            <FontAwesomeIcon
              className={styles.resultHeaderIcon}
              height="1.3em"
              icon={faMusic}
              />
          }
          </>
        }
      </div>
      <ReleaseDate show={!dispData.hasCoverArt} />
      </>
      }
    </div>
    {(dispData.title) && dispData.tracks ?
    <>
      <div className={styles.count}>Tracks: {dispData.tracks.length} found</div>
      <div className={styles.resultsList} ref={scrollableRef}>
        {dispData.tracks.map((_,i) =>
          <div
            key={_.id}
            onClick={handleClick(_.rid, _.title)}
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
  </div>
  )
}