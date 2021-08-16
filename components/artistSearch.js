import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState, useResetRecoilState,
         useRecoilValueLoadable,
         useSetRecoilState} from 'recoil'
import { searchTermsAtom,
         searchResultsSel,
         searchHlIndexAtom,
         searchScrollTopAtom,
         currentArtistAtom,
         currentReleaseGroupAtom,
         currentReleaseAtom,
         currentRecordingAtom,
         resetThenSetValue
} from '../models/musicbrainz'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/ArtistSearch.module.scss'

export default function ArtistSearch({}) {

  const [errored, setErrored] = useState(false)
  const [searchTerms, setSearchTerms] = useRecoilState(searchTermsAtom)
  const [scrollTop, setScrollTop] = useRecoilState(searchScrollTopAtom)
  const [hlIndex, setHlIndex] = useRecoilState(searchHlIndexAtom)
  const resetReleaseGroup = useResetRecoilState(currentReleaseGroupAtom)
  const resetRelease = useResetRecoilState(currentReleaseAtom)
  const resetRecording = useResetRecoilState(currentRecordingAtom)
  const resetThenSet = useSetRecoilState(resetThenSetValue)

  const searchQuery = useRecoilValueLoadable(searchResultsSel)

  useEffect(() => {
    switch (searchQuery.state) {
      case 'loading':
        break;
      case 'hasValue':
        setErrored(false)
        break;
      case 'hasError':
        console.log(searchQuery.contents)
        setErrored(true)
      default:
        break;
    }
  },[searchQuery.state, searchQuery.contents])

  useEffect(() => {
    inputRef.current.focus()
    return () => clearTimeout(toRef)
  }, [toRef])

  var toRef
  const handleChange = (e) => {
    clearTimeout(toRef)
    const newterms = e.target.value
    // Default 500ms delay to avoid spamming api
    var ms = 500
    // HACK: use key events instead
    // Longer search delay if we just started deleting, to outlast backspace repeat delay
    ms = newterms == searchTerms.slice(0,-1) ? 1000 : ms
    if (newterms.length > 1) {
      toRef = setTimeout(() => {
        setSearchTerms(newterms)
      }, ms)
    } else {
      setSearchTerms('')
    }
  }

  const handleClick = (id, name) => {
    return () => {
      setScrollTop(document.getElementById('searchIncResultList')?.scrollTop)
      resetRecording()
      resetRelease()
      resetReleaseGroup()
      resetThenSet({atom: currentArtistAtom, id: id, name: name})
    }
  }

  const handleIconClick = () => {
    inputRef.current.focus()
  }

  const syncFocus = (hli) => {
    const listEl = document.getElementById("searchIncResultList")
    if(document.activeElement?.parentElement == listEl) {
      listEl.children[hli]?.focus()
    }
  }

  const handleMouseEnter = (e) => {
    if (Date.now() - navKeyTs.current < 1000) {
      return false
    }
    var hli = parseInt(e.target.attributes['index'].value)
    setHlIndex(hli)
    syncFocus(hli)
  }

  class listNavKey {
    constructor(constrain, step, limit, triggerPercent) {
      this.constrain = constrain
      this.step = step
      this.limit = limit
      this.triggerPercent = triggerPercent
    }
    shouldScroll = function(elem) {
      let p = elem.parentElement
      let parentScrollTop = p.scrollTop
      let totContainerHeight = p.scrollHeight
      let vizContainerHeight = p.offsetHeight
      let vizItemOffset = elem.offsetTop - parentScrollTop
      if (this.step == -1 && p.scrollTop == 0) {
        // already at the top
        return false
      }
      if (this.step == 1 && (totContainerHeight - (vizContainerHeight + parentScrollTop)) == 1) {
        // already at the bottom
        return false
      }
      // if we're moving up measure from the bottom (height of parent)
      // if we're moving down measure from from 0
      let basis = (this.step == -1) ? vizContainerHeight : 0
      let offsetDiff = Math.abs(basis - vizItemOffset)
      return offsetDiff > vizContainerHeight * this.triggerPercent
    }
    scrollOptions = function(elem) {
      return {top: elem.clientHeight*this.step, left: 0, behavior: "smooth"}
    }
  }

  const UPDOWNKEYNAMES = {
    ArrowDown: new listNavKey(Math.min,  1, null, .6),
    ArrowUp:   new listNavKey(Math.max, -1,   -1, .6)
  }

  const handleKeyDown = (e) => {
    const listEl = document.getElementById("searchIncResultList")
    let navKey = UPDOWNKEYNAMES[e.key]
    if (navKey) {
      if (window.visualViewport == undefined) {
        console.log("No viewport. In firefox about:config set dom.visualviewport.enabled = true")
        return
      }

      let c = listEl?.children.length
      // One modification for the down key
      UPDOWNKEYNAMES.ArrowDown.limit = c-1

      // don't exceed our bounds
      let hli = navKey.constrain(hlIndex + navKey.step, navKey.limit)
      // is scrolling even possible?
      if (hli != hlIndex && hli != -1) {
        let newHl = listEl.children[hli]
        if (navKey.shouldScroll(newHl)) {
          navKeyTs.current = Date.now()
          listEl.scrollBy(navKey.scrollOptions(newHl))
        }
      }
      setHlIndex(hli)
      syncFocus(hli)
      e.preventDefault()
    } else if (e.key == "Enter") {
      const listItem = listEl?.children[hlIndex]
      const id = listItem?.attributes['rid'].value
      const name = listItem?.textContent
      if (id) {
        handleClick(id, name)()
      }
    }
  }

  useEffect(() => {
    document.getElementById('searchIncResultList')?.scrollBy({top: scrollTop, left: 0})
  },[scrollTop])

  const inputRef = useRef()

  var navKeyTs = useRef(0)

  return (
    <div className={styles.searchContainer}>
      <FontAwesomeIcon
        className={styles.icon}
        height="1em"
        icon={faSearch}
        onClick={handleIconClick}
      />
      <div className={styles.inputContainer}>
        <input type="text" onKeyDown={handleKeyDown} onChange={handleChange} ref={inputRef} className={styles.input} defaultValue={searchTerms} placeholder="Artist search..."/>
        {!errored && searchQuery.state == 'hasValue' &&
        <>
          {searchQuery.contents.matches?.length > 0 &&
            <div className={styles.searchIncResultList} id="searchIncResultList">
            {searchQuery.contents.matches.map((_,i) =>
            <div className={`${styles.searchIncResult} ${hlIndex==i && styles.searchIncResultHl}`} index={i} rid={_.id} key={_.id}
              onClick={handleClick(_.id, _.name)} onKeyDown={handleKeyDown} onMouseEnter={handleMouseEnter} onFocus={handleMouseEnter} tabIndex="0">
              {_.name}
            </div>
            )}
            </div>
          }
          {searchQuery.contents.matches?.length == 0 && searchTerms &&
            <div className={styles.searchIncResultList} id="searchIncResultList">
              <div className={`${styles.searchIncResult} ${styles.searchIncResultWarn}`}>No results found</div>
            </div>
          }
        </>
        }
        {errored &&
          <div className={styles.searchIncResultList} id="searchIncResultList">
            <div className={`${styles.searchIncResult} ${styles.searchIncResultWarn}`}>{searchQuery.contents.message}</div>
          </div>
        }
      </div>
    </div>
  )
}