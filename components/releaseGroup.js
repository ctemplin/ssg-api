import React,{useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/ResultBlock.module.scss'

export default function ReleaseGroup({id, handleReleaseClick}) {
  
  const [theData, setTheData] = useState({})
  const [hlIndex, setHlIndex] = useState(-1)

  useEffect(() => {
    setHlIndex(-1)
    const getData = async () => {
      var url = new URL('https://musicbrainz.org/ws/2/release-group/' + id)
      const params = new URLSearchParams()
      params.append("inc", "releases")
      url.search = params.toString()
      const resp = await fetch(
        url,
        {
          headers: {"Accept": "application/json"},
        }
        )
        const json = await resp.json()
        const firstReleaseDate = new Date(
          json['first-release-date'])
          .toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'}
          )
        setTheData(
          {
            title: json.title, 
            firstReleaseDate: firstReleaseDate == "Invalid Date" ? null : firstReleaseDate,
            releases:
            json['releases'].map(release => {
              return {
                id: release.id,
                title: release.title,
                date: release['date']
              }
            })
          }
        )
    }
    getData()
    const listDiv = releasesScrollable.current
    if (listDiv) listDiv.scrollTop = 0
  },[id])

  useEffect(() => {
    if (theData?.releases?.length == 1)
    releaseEls.current[0].click()
  },[theData])

  const handleClick = (id, i = {}) => {
    return () => {
      setHlIndex(i)
      handleReleaseClick(id)
    };
  }
    
    const releasesScrollable = useRef()
    const releaseEls = useRef({})

  return (
    <div>
      <div className={`block`}>
        <div className={styles.blockType}>Release</div>
        <div className={`${styles.blockHeader} level`}>
          <span className={`is-size-4`}>{theData.title}</span>
          <FontAwesomeIcon
          className={styles.resultHeaderIcon}
          height="1.3em"
          icon={faCompactDisc}
          />
        </div>
        <div className={`is-size-6`}>{theData.firstReleaseDate ?? <>&nbsp;</>}</div>
    </div>
    {theData.releases ?
    <>
      <div className={`is-size-7`}>Versions: {theData.releases.length} found</div>
      <div className={styles.rgpop} ref={releasesScrollable}>
      {theData.releases.map((_,i) => 
        <div onClick={handleClick(_.id,i)} key={_.id}  ref={(el) => releaseEls.current[i] = el}
        className={`${styles.resultItem} ${hlIndex==i?styles.resultItemHl:''}`}>
          <span className={styles.releaseTitle}>{_.title}</span>
        <span className={styles.releaseDate}>{_.date?.substr(0,4)}</span>
        </div>
      )}
      </div>
    </>
    :
    <></>
    }
    </div>
  )
}