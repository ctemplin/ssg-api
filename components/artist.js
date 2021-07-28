import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import { artistLookup, currentArtistAtom, currentReleaseGroupAtom } from '../models/musicbrainz'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophoneAlt, faSort } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/ResultBlock.module.scss'
import formatDate, { extractYear, sortDateStrings } from '../lib/dates'
import ResultSectionHeader from './resultSectionHeader'
import NetworkError from './networkError'

export default function Artist({id}) {

  const [hlId, setHlId] = useState(null)
  const setCurrentReleaseGroup = useSetRecoilState(currentReleaseGroupAtom)
  const [errored, setErrored] = useState(false)
  const sortColumns = [
    ['default', 'Type/Date'], ['title', 'Title'], ['firstReleaseDate', 'Date']
  ]
  const [sortCfg, setSortCfg] = useState({column: 'default', dir: 'asc'})
  const [showSortMenu, setShowSortMenu] = useState(false)

  const [data, setCurrentArtist] = useRecoilState(currentArtistAtom)

  const fetchData = useRecoilValueLoadable(artistLookup(id))

  useEffect(() => {
    switch (fetchData.state) {
      case 'loading':
        break;
      case 'hasValue':
        setCurrentArtist(fetchData.contents)
        setErrored(false)
        break;
      case 'hasError':
        console.log(data.contents)
        setErrored(true)
      default:
        break;
    }
  },[fetchData.state])

  function handleClick(id, title) {
    return () => {
      setHlId(id)
      setCurrentReleaseGroup({id: id, title: title})
    }
  }

  const sortRgs = (a,b) => {
    let ret = 0
    switch (sortCfg.column) {
      case 'default':
        ret = 0
        break
      case 'firstReleaseDate':
        ret = sortDateStrings(a.firstReleaseDate, b.firstReleaseDate)
        break
      case 'title':
        if (a.title == b.title) {
          ret = 0
          break
        }
        ret = a.title > b.title ? 1 : -1
        break
    }
    return ret
  }

  const handleSortChoice = (column) => {
    return () => {
      setSortCfg({column: column, dir:'asc'})
      setShowSortMenu(false)
    }
  }

  const lsBeginFmt = data.lsBegin ? formatDate(data.lsBegin) : ''
  const lsEndFmt = data.lsEnd ? formatDate(data.lsEnd) : 'present'
  const varyingFieldNames = ["type1", "type2"]
  let prevItem = null

  return (
    <div className={styles.block}>

      <div>
        <div className={styles.blockType}>Artist</div>
        {errored &&
          <NetworkError errorMsg={data.contents?.message} />
        }
        {!errored &&
        <>
        <div className={styles.blockHeader}>
          <span className={styles.blockHeaderTitle}>{data.name}</span>
          <FontAwesomeIcon
            className={styles.resultHeaderIcon}
            height="1.4em"
            icon={faMicrophoneAlt}
          />
        </div>
        <div className={styles.blockHeaderDate}>
          {lsBeginFmt && `${lsBeginFmt} to ${lsEndFmt}`}
        </div>
        </>
        }
      </div>
      {!errored && data.releaseGroups &&
      <>
        <div className={styles.count}>
          Releases: {data.releaseGroups.length} found
          <div className={styles.sortContainer}>
            <FontAwesomeIcon
              className={styles.resultUtilIcon}
              height="1.3em"
              icon={faSort}
              onClick={() => setShowSortMenu(!showSortMenu)}
            />
            <div className={`${showSortMenu ? styles.sortMenu : styles.sortMenuHidden}`}>
              <div>
              {sortColumns.map(_ =>
                <div
                  key={_[0]}
                  className={`
                    ${styles.sortChoice}
                    ${_[0]==sortCfg.column && styles.sortChoiceActive}
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
        {Array.from(data.releaseGroups).sort(sortRgs).map((_,i) => {
          const ret = (
            <>
            {sortCfg.column == 'default' &&
              <ResultSectionHeader curItem={_} prevItem={prevItem}
                fieldNames={varyingFieldNames} />
            }
            <div onClick={handleClick(_.id, _.title)} key={_.id}
              className={`
                ${i % 2 ? styles.resultItemAlt : styles.resultItem}
                ${hlId==_.id?styles.resultItemHl:''}
              `}
            >
              <span className={styles.releaseTitle}>{_.title}</span>
              <span className={styles.releaseDate}>
                {extractYear(_.firstReleaseDate) ?? ``}
              </span>
            </div>
            </>
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