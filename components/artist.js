import React,{useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/ResultBlock.module.scss'

export default function Artist({name, lsBegin, lsEnd, releaseGroups, handleReleaseClick, handleParentSearchClick}) {
  
  const [showAlbums, setShowAlbums] = useState(false)
  const [hlIndex, setHlIndex] = useState(-1)
  const albumClick = (e) => {
    setShowAlbums(!showAlbums)
  }
  
  function handleClick(id, i = {}) {
    return () => {
      setHlIndex(i)
      handleReleaseClick(id)
    };
  }

  const lsBeginFmt = lsBegin ? new Date(lsBegin).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'}) : '';
  const lsEndFmt = lsEnd ? new Date(lsEnd).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'}) : 'present';

  return (
    <div>
      <div className={`block`}>
        <div className={styles.blockType}>Artist</div>
        <div className={`${styles.blockHeader} level`}>
          <span className={`is-size-4 ${styles.blockHeaderTitle}`}>{name}</span>
          <FontAwesomeIcon
          className={styles.resultHeaderIcon}
          height="1.4em"
          icon={faMicrophoneAlt}
          />
        </div>
        <div className={`is-size-6 ${styles.blockHeaderDate}`}>{lsBeginFmt ? `${lsBeginFmt} to ${lsEndFmt}` : '' }</div>
      </div>
      {releaseGroups ? 
      <>
        <div className={`is-size-7`}>Releases: {releaseGroups.length} found</div>
        <div className={styles.rgpop}>
        {releaseGroups.map((_,i) => {
          // set empty date strings to undefined
          const firstReleaseDate = _.firstReleaseDate.length ? new Date(_.firstReleaseDate) : undefined
          return(
            <div onClick={handleClick(_.id, i)} index={i} key={_.id}
            className={`${styles.resultItem} ${hlIndex==i?styles.resultItemHl:''}`}>
              <span className={styles.releaseTitle}>{_.title}</span>
              <span className={styles.releaseDate}>{firstReleaseDate?.toLocaleDateString(undefined, {year: 'numeric'})}</span>
            </div>
          )
        }
        )}
        </div>
      </>
      :
      <></>
      }
    </div>
  )
}