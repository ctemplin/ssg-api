import React,{useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/ResultBlock.module.scss'
import formatDate, {extractYear} from '../lib/dates'

export default function Artist({id, handleReleaseClick, handleParentSearchClick}) {

  const [showAlbums, setShowAlbums] = useState(false)
  const [hlIndex, setHlIndex] = useState(-1)
  const [data, setData] = useState({})

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
      setHlIndex(i)
      handleReleaseClick(id)
    };
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
        <div className={styles.count}>Releases: {data.releaseGroups.length} found</div>
        <div className={styles.resultsList}>
        {data.releaseGroups.map((_,i) => {
          // set empty date strings to undefined
          return(
            <div onClick={handleClick(_.id, i)} index={i} key={_.id}
            className={`${i % 2 ? styles.resultItemAlt : styles.resultItem} ${hlIndex==i?styles.resultItemHl:''}`}>
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