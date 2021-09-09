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
  const resetThenSet = useSetRecoilState(resetThenSetValue)
  const setCoverArt = useSetRecoilState(currentReleaseCoverArtAtom)

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
    if (window.visualViewport?.width <= 768) {
      head.current?.scrollIntoView({behavior: "smooth"})
    }
  },[dispData.id])

  const handleClick = (id, title) => {
    return () => resetThenSet({atom: currentRecordingAtom, id: id, title: title})
  }

  const head = useRef()

  if (!dispData.id) { return null }
  return (
  <div ref={head} className={styles.block}>
    <h2 className={styles.blockTypeH}>
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
            {dispData.title}
            {dispData.country &&
              /* Span and space+parens on same line for proper spacing/wrapping */
              <span className={styles.releaseCountryWrapper}> (
                <span className={styles.releaseCountry}>{dispData.country}</span>
              )</span>
            }
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
    </h2>
    {(dispData.title) && dispData.tracks ?
    <>
      <div className={styles.count}><span id="recordingListLbl">Tracks: {dispData.tracks.length} found</span></div>
      <div className={styles.resultsList} ref={scrollableRef} role="list"
        aria-labelledby="recordingListLbl"> 
        {dispData.tracks.map((_,i) =>
          <div
            key={_.id} role="listitem"
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