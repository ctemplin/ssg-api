import React,{useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc, faFilter } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/ResultBlock.module.scss'

export default function ReleaseGroup({id, handleReleaseClick}) {
  
  const [theData, setTheData] = useState({})
  const [hlIndex, setHlIndex] = useState(-1)
  const [countries, setCountries] = useState(new Set([]))
  const [userCountries, setUserCountries] = useState(new Set(["US"]))

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
            id: json.id,
            title: json.title, 
            firstReleaseDate: firstReleaseDate == "Invalid Date" ? null : firstReleaseDate,
            releases:
            json['releases'].map(release => {
              setCountries(countries.add(release.country))
              return {
                id: release.id,
                title: release.title,
                date: release['date'],
                country: release.country
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
    if (theData?.releaseEls?.current.length == 1)
    releaseEls.current[0].click()
  },[theData])

  const handleClick = (id, i = {}) => {
    return () => {
      setHlIndex(i)
      handleReleaseClick(id)
    };
  }
  const countryFilter = _=> userCountries.has(_.country)

  useEffect(() => {
    head.current?.scrollIntoView({behavior: "smooth"})
  },[theData.id])

  const releasesScrollable = useRef()
  const releaseEls = useRef({})
  const head = useRef()

  return (
    <div ref={head}>
      <div>
        <div className={styles.blockType}>Release</div>
        <div className={`${styles.blockHeader} level`}>
          <span className={`is-size-4 ${styles.blockHeaderTitle}`}>{theData.title}</span>
          <FontAwesomeIcon
          className={styles.resultHeaderIcon}
          height="1.3em"
          icon={faCompactDisc}
          />
        </div>
        <div className={`is-size-6 ${styles.blockHeaderDate}`}>{theData.firstReleaseDate ?? <>&nbsp;</>}</div>
      </div>
      {theData.releases ?
      <>
        <div className={`is-size-7 ${styles.countFilter}`}>
          <FontAwesomeIcon
          className={styles.resultFilterIcon}
          height="1.3em"
          icon={faFilter}
          />  
          <span>Versions: {theData.releases.length - theData.releases.filter(countryFilter).length} filtered out</span>
        </div>
        <div className={styles.rgpop} ref={releasesScrollable}>
          {theData.releases.filter(countryFilter).map((_,i) => 
          <div onClick={handleClick(_.id,i)} key={_.id}  ref={(el) => releaseEls.current[i] = el}
          className={`${i % 2 ? styles.resultItemAlt : styles.resultItem} ${hlIndex==i?styles.resultItemHl:''}`}>
            <span className={styles.releaseTitle}>{_.title} {userCountries.size > 1 && _.country ? `(${_.country})` : ``}</span>
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