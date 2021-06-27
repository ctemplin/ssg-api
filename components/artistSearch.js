import React, {useEffect, useState, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/ArtistSearch.module.scss'

export default function ArtistSearch({handleArtistSearchClick}) {

  const defaultData = {matches: []}
  const [theData, setTheData] = useState(defaultData)
  const [searchTerms, setSearchTerms] = useState('')

  useEffect(() => {
    const getData = async () => {
      var url = new URL('https://musicbrainz.org/ws/2/artist')
      const params = new URLSearchParams()
      params.append("query", searchTerms)
      params.append("limit", 10)
      params.append("offset", 0)
      url.search = params.toString()
      const resp = await fetch(
        url,
        {
            headers: {"Accept": "application/json"},
        }
      )
      const json = await resp.json()
      setTheData(
      {
        matches:
          json.artists.map(artist => {
            return {
              name: artist.name, 
              id: artist.id, 
            }
          })
      }
      )
    }
    if (searchTerms.length)
      getData()
  },[searchTerms])

  useEffect(() => {
    // setTimeout(() => {
    inputRef.current.focus();
    //   }, 1);
    return () => clearTimeout(toRef)
  }, [toRef])

  var toRef
  const handleChange = (e) => {
    clearTimeout(toRef)
      if (e.target.value.length > 1) {
      toRef = setTimeout(() => {
        setSearchTerms(e.target.value)
      }, 500)
    } else {
      setTheData(defaultData)
      setSearchTerms('')
    }
  }

  const handleClick = (id) => {
    return () => handleArtistSearchClick(id)
  }

  const handleIconClick = () => {
    inputRef.current.focus();
  }

  const inputRef = useRef()

  return (
    <div className={`${styles.searchContainer} is-size-1`}>
      <div className={`${styles.inputLevel} level`}>
      <FontAwesomeIcon
        className={styles.icon}
        height="1em"
        icon={faSearch}
        onClick={handleIconClick}
      />
      <input type="text" onChange={handleChange} ref={inputRef} className={styles.input} size="14" placeholder="Artist search..."/></div>
      {theData.matches.length ?
        <div className={styles.searchIncResultList}>
          {theData.matches.map(_ =>
          <div className={`${styles.searchIncResult} panel-block`} key={_.id} onClick={handleClick(_.id)}>
            {_.name}
          </div>
          )}
        </div>
      :
        <></>
      }
    </div>
  )
}