import React, { useState, Fragment } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentReleaseGroupAtom, currentReleaseAtom, currentRecordingAtom,
  resetThenSetValue, currentArtistPanelFormatSorted} from '../models/musicbrainz'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophoneAlt, faSortAmountUp, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/ResultBlock.module.scss'
import { extractYear } from '../lib/dates'
import ResultSectionHeader from './resultSectionHeader'
import NetworkError from './networkError'

export default function Artist(
  {dispData, errored=false, errorMsg, params, setParams}) {

  const currentReleaseGroup = useRecoilValue(currentReleaseGroupAtom)
  const resetThenSet = useSetRecoilState(resetThenSetValue)
  // Alias the generic HOC "params" to something meaningful
  const [sortCfg, setSortCfg] = [params, setParams]
  const sortColumns = [
    ['default', 'Type/Date'], ['title', 'Title'], ['firstReleaseDate', 'Date']
  ]
  const [showSortMenu, setShowSortMenu] = useState(false)

  function handleClick(id, title) {
    return () => {
      resetThenSet({atom: currentReleaseGroupAtom, id: id, title: title})
    }
  }

  const handleSortChoice = (column) => {
    return () => {
      let dir = 'asc'
      if (column == sortCfg.column) {
        dir = sortCfg.dir == 'asc' ? 'desc' : 'asc'
      }
      setShowSortMenu(false)
      setSortCfg({column: column, dir: dir})
    }
  }

  const varyingFieldNames = ["type1", "type2"]
  let prevItem = null
  const didTypeChange = (item) => {
    return !prevItem || varyingFieldNames.some(fn => item[fn] != prevItem[fn])
  }

  return (
    <div className={styles.block}>

      <div>
        <div className={styles.blockType}>Artist</div>
        {errored &&
          <NetworkError errorMsg={errorMsg} />
        }
        {!errored &&
        <>
        <div className={styles.blockHeader}>
          <span className={styles.blockHeaderTitle}>{dispData.name}</span>
          <FontAwesomeIcon
            className={styles.resultHeaderIcon}
            height="1.4em"
            icon={faMicrophoneAlt}
          />
        </div>
        <div className={styles.blockHeaderDate}>
          {dispData.lsBegin && `${dispData.lsBegin} to ${dispData.lsEnd}`}
        </div>
        </>
        }
      </div>
      {!errored && dispData.releaseGroups &&
      <>
        <div className={styles.count}>
          Releases: {dispData.releaseGroups.length} found
          <div className={styles.sortContainer}>
            <FontAwesomeIcon
              className={styles.resultUtilIcon}
              height="1.3em"
              icon={sortCfg.dir == 'desc' ? faSortAmountDown : faSortAmountUp}
              onClick={() => setShowSortMenu(!showSortMenu)}
            />
            <div className={`${showSortMenu ? styles.sortMenu : styles.sortMenuHidden}`}>
              <div>
              {sortColumns.map(_ =>
                <div
                  key={_[0]}
                  className={`
                    ${styles.sortChoice}
                    ${_[0] == sortCfg.column && styles.sortChoiceActive}
                  `}
                  onClick={handleSortChoice(_[0])}>
                  {_[1]}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.resultsList}>
        {Array.from(dispData.releaseGroups).map((_,i) => {
          const ret = (
            <Fragment key={`${_.id}`}>
            {sortCfg.column == 'default' && didTypeChange(_) &&
              <ResultSectionHeader type1={_.type1} type2={_.type2}/>
            }
            <div onClick={handleClick(_.id, _.title)}
              className={`
                ${i % 2 ? styles.resultItemAlt : styles.resultItem}
                ${_.id == currentReleaseGroup.id ? styles.resultItemHl:''}
              `}
            >
              <span className={styles.releaseTitle}>{_.title}</span>
              <span className={styles.releaseDate}>
                {extractYear(_.firstReleaseDate) ?? ``}
              </span>
            </div>
            </Fragment>
          )
          prevItem = _
          return ret
        }
        )}
        </div>
      </>
      }
    </div>
  )
}