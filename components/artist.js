import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophoneAlt, faSortAmountUp, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/ResultBlock.module.scss'
import GroupableResults from './groupableResults'
import NetworkError from './networkError'

export default function Artist(
  {dispData, errored=false, errorMsg, params, setParams}) {

  // Alias the generic HOC "params" to something meaningful
  const [sortCfg, setSortCfg] = [params, setParams]
  const sortColumns = [
    ['default', 'Type/Date'], ['title', 'Title'], ['firstReleaseDate', 'Date']
  ]
  const [showSortMenu, setShowSortMenu] = useState(false)

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

  return (
    <div className={styles.block}>
      <h2 className={styles.blockTypeH}>
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
      </h2>
      {!errored && dispData.releaseGroups &&
      <>
        <div className={styles.count}>
          <span id="releaseGroupListLbl" >Releases: {dispData.releaseGroups.flat().length} found</span>
          <div className={styles.sortContainer}>
            <FontAwesomeIcon
              className={styles.resultUtilIcon}
              height="1.3em"
              icon={sortCfg.dir == 'desc' ? faSortAmountDown : faSortAmountUp}
              title="Sort the Releases"
              onClick={() => setShowSortMenu(!showSortMenu)}
              aria-haspopup="true"
            />
            <div className={`${showSortMenu ? styles.sortMenu : styles.sortMenuHidden}`}
              role="dialog" aria-label="Sort options. Select active option to reverse sort." >
              <div role="group">
              {sortColumns.map(_ =>
                <div role="checkbox" aria-multiselectable="false" aria-checked={_[0] == sortCfg.column}
                className={`${_[0] == sortCfg.column ? styles.sortChoiceActive : styles.sortChoice}`}
                  tabIndex="0" key={_[0]}
                  onClick={handleSortChoice(_[0])}>
                  {_[1]}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.resultsList} role="list" aria-labelledby="releaseGroupListLbl">
        {dispData.releaseGroups.map((_,i) => <GroupableResults props={_} i={i} key={_.id ?? i}/>)}
        </div>
      </>
      }
    </div>
  )
}