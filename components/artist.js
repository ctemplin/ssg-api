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

  const AllItemRows = ({props, i}) => (props instanceof Array) ?
    <GroupedItems items={props} i={i} />
    :
    <SingleItem item={props} i={i} />

  const GroupedItems = ({items, i}) =>
    <div key={`${items[0].id}`} role="group">
      <ResultSectionHeader type1={items[0].type1} type2={items[0].type2} />
      <ItemList items={items} />
    </div>

  const ItemList = ({items}) => 
    items.map((item,i) => <SingleItem item={item} i={i} />)

  const SingleItem = ({item, i}) => 
    <Fragment key={`${item.id}`}>
    <div onClick={handleClick(item.id, item.title)} role="listitem"
      className={`
        ${i % 2 ? styles.resultItemAlt : styles.resultItem}
        ${item.id == currentReleaseGroup.id ? styles.resultItemHl:''}
      `}
    >
      <span className={styles.releaseTitle}>{item.title}</span>
      <span className={styles.releaseDate}>
        {extractYear(item.firstReleaseDate) ?? ''}
      </span>
    </div>
    </Fragment>

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
          Releases: {dispData.releaseGroups.flat().length} found
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
        <div className={styles.resultsList} role="list">
        {dispData.releaseGroups.map((_,i) => <AllItemRows props={_} i={i} />)}
        </div>
      </>
      }
    </div>
  )
}