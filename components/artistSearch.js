import React, {useEffect, useState, useRef} from 'react'
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/ArtistSearch.module.scss'

export default function ArtistSearch({handleArtistSearchClick}) {

  const defaultData = {matches: []}
  const [theData, setTheData] = useState(defaultData)
  const [searchTerms, setSearchTerms] = useState('')
  const [hlIndex, setHlIndex] = useState(-1)

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

  const handleMouseEnter = (e) => {
    var hli = parseInt(e.target.attributes['index'].value)
    setHlIndex(hli)
  }

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        var hli = hlIndex
        console.log(hli)
        var c = document.getElementById("searchIncResultList")?.children.length
        // wrap around, starting back at no selection
        hli = hli >= c-1 ? -1 : hli + 1
        setHlIndex(hli)
        e.preventDefault()
        break;
      case "ArrowUp":
        var hli = hlIndex
        var c = document.getElementById("searchIncResultList")?.children.length
        // wrap around, starting back at no selection
        hli = hli <= -1 ? c-1 : hli - 1
        setHlIndex(hli)
        e.preventDefault()
        break;
      case "Enter":
        const rid = document.getElementById("searchIncResultList")?.children[hlIndex]?.attributes['rid'].value
        if (rid) handleArtistSearchClick(rid)
        break
    }
  } 

  const inputRef = useRef()

  return (
    <div className={`${styles.searchContainer} is-size-3 is-size-1-desktop`}>
      <div className={`${styles.inputLevel} level`}>
      <FontAwesomeIcon
        className={styles.icon}
        height="1em"
        icon={faSearch}
        onClick={handleIconClick}
      />
      <input type="text" onKeyDown={handleKeyDown} onChange={handleChange} ref={inputRef} className={styles.input} placeholder="Artist search..."/>
      {theData.matches.length ?
        <div className={styles.searchIncResultList} id="searchIncResultList">
          {theData.matches.map((_,i) =>
          <div className={`${styles.searchIncResult} panel-block ${hlIndex==i?styles.searchIncResultHl:''}`} index={i} rid={_.id} key={_.id}
            onClick={handleClick(_.id)} onMouseEnter={handleMouseEnter} >
            {_.name}
          </div>
          )}
        </div>
      :
        <></>
      }
      </div>
    </div>
  )
}