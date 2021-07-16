import React,{useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneAlt, faSort } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/ResultBlock.module.scss'
import formatDate, {extractYear} from '../lib/dates'

export default function Artist({id, handleReleaseClick}) {

  const [showAlbums, setShowAlbums] = useState(false)
  const [hlId, setHlId] = useState(null)
  const [data, setData] = useState({})
  const sortColumns = [['default', 'Default'], ['title', 'Title'], ['firstReleaseDate', 'Date']]
  const [sortCfg, setSortCfg] = useState({column: 'default', dir: 'asc'})
  const [showSortMenu, setShowSortMenu] = useState(false)

  useEffect(() => {
    async function getData(){
      if (!id) return
      var url = new URL('https://musicbrainz.org/ws/2/artist/' + id)
      const params = new URLSearchParams()
      params.append("inc", "release-groups")
      url.search = params.toString()
      const resp = await fetch(
        url,
        {
          headers: {"Accept": "application/json"},
        }
      )
      const json = await resp.json()
      setData(
        {
          name: json.name,
          lsBegin: json['life-span']?.begin,
          lsEnd: json['life-span']?.end,
          releaseGroups:
            json['release-groups'].map(album => {
              return {
                id: album.id,
                title: album.title,
                firstReleaseDate: album['first-release-date']
              }
            })
        }
      )
    }
    getData()
  }
  ,[id])

  const albumClick = (e) => {
    setShowAlbums(!showAlbums)
  }

  function handleClick(id, i = {}) {
    return () => {
      setHlId(id)
      handleReleaseClick(id)
    };
  }

  const sortRgs = (a,b) => {
    let ret = 0
    switch (sortCfg.column) {
      case 'default':
        ret = 0
        break
      case 'firstReleaseDate':
        ret = extractYear(a.firstReleaseDate) - extractYear(b.firstReleaseDate)
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

  const lsBeginFmt = data.lsBegin ? formatDate(data.lsBegin) : '';
  const lsEndFmt = data.lsEnd ? formatDate(data.lsEnd) : 'present';

  return (
    <div className={styles.block}>
      <div>
        <div className={styles.blockType}>Artist</div>
        <div className={styles.blockHeader}>
          <span className={styles.blockHeaderTitle}>{data.name}</span>
          <FontAwesomeIcon
          className={styles.resultHeaderIcon}
          height="1.4em"
          icon={faMicrophoneAlt}
          />
        </div>
        <div className={styles.blockHeaderDate}>{lsBeginFmt ? `${lsBeginFmt} to ${lsEndFmt}` : '' }</div>
      </div>
      {data.releaseGroups ?
      <>
        <div className={styles.count}>
          Releases: {data.releaseGroups.length} found
          <div className={styles.sortContainer}>
            <FontAwesomeIcon
            className={styles.resultUtilIcon}
            height="1.3em"
            icon={faSort}
            onClick={() => setShowSortMenu(!showSortMenu)}
            /><div className={`${showSortMenu ? styles.sortMenu : styles.sortMenuHidden}`}>
              <div>
              {sortColumns.map(_ => 
                <div key={_[0]} 
                  className={`${styles.sortChoice} ${_[0]==sortCfg.column && styles.sortChoiceActive}`}
                  onClick={handleSortChoice(_[0])}>{_[1]}</div>  
              )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.resultsList}>
        {Array.from(data.releaseGroups).sort(sortRgs).map((_,i) => {
          return(
            <div onClick={handleClick(_.id, i)} key={_.id}
            className={`${i % 2 ? styles.resultItemAlt : styles.resultItem} ${hlId==_.id?styles.resultItemHl:''}`}>
              <span className={styles.releaseTitle}>{_.title}</span>
              <span className={styles.releaseDate}>{extractYear(_.firstReleaseDate) ?? ``}</span>
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