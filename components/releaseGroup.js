import React,{useState, useEffect, useRef} from 'react'
import {useCookies} from 'react-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc, faFilter } from '@fortawesome/free-solid-svg-icons';
import FilterConfig from './filterConfig'
import styles from '../styles/ResultBlock.module.scss'

export default function ReleaseGroup({id, handleReleaseClick}) {

  const [theData, setTheData] = useState({})
  const [hlIndex, setHlIndex] = useState(-1)
  const [cookies, setCookie] = useCookies()
  const defaultCountries = cookies.countries || ["US", "??"]
  const [countries, setCountries] = useState(new Set(defaultCountries))
  const [userCountries, setUserCountries] = useState(new Set(defaultCountries))
  const [showFilterConfig, setShowFilterConfig] = useState(false)

  useEffect(() => {
    setHlIndex(-1)
    setUserCountries(new Set(defaultCountries))
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
        const _countries = new Set()
        setTheData(
          {
            id: json.id,
            title: json.title,
            firstReleaseDate: firstReleaseDate == "Invalid Date" ? null : firstReleaseDate,
            releases:
            json['releases'].map(release => {
              _countries.add(release.country || "??")
              return {
                id: release.id,
                title: release.title,
                date: release['date'],
                country: release.country || "??"
              }
            })
          }
        )
        setCountries(_countries)
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

  const countryFilter = (_,i,a) => a.length == 1 || userCountries.has(_.country)

  useEffect(() => {
    head.current?.scrollIntoView({behavior: "smooth"})
  },[theData.id])

  const handleFilterClick = (e) => {
    setShowFilterConfig(true)
  }

  const handleCountryChange = (e) => {
    const target = e.target
    target.checked ?
      setUserCountries(new Set(userCountries.add(target.name)))
    :
      userCountries.delete(target.name) ? setUserCountries(new Set(userCountries)) : null
  }

  const persistCountryChanges = () => {
    // Combine previously saved countries with currently relevant one
    var ca = cookies.countries.concat(Array.from(countries))
    // Keep countries that are not currently relevant, or relevant and chosen
    ca = ca.filter(_ => (!countries.has(_)) || countries.has(_) && userCountries.has(_))
    setCookie("countries", ca)
  }

  const handleCloseClick = () => {
    setShowFilterConfig(false)
  }

  const isCountryNeeded = () => {
    if (theData.releases.length == 1 && !userCountries.has(theData.releases[0].country))
      // Showing the SOLE release despite it failing the country filter,
      // so make that clear.
      return true
    if ((userCountries.size == 1) || 
        (userCountries.size == 2 && userCountries.has("??"))
       )
       // Too little country variety to clutter the UI with
       return false
    // Showing releases from a mix of countries
    return true
  }

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
          onClick={handleFilterClick}
          />
          <span>Versions: {theData.releases.length - theData.releases.filter(countryFilter).length} filtered out</span>
        </div>
        <div className={styles.rgpop} ref={releasesScrollable}>
          {theData.releases.filter(countryFilter).map((_,i) =>
          <div onClick={handleClick(_.id,i)} key={_.id}  ref={(el) => releaseEls.current[i] = el}
          className={`${i % 2 ? styles.resultItemAlt : styles.resultItem} ${hlIndex==i?styles.resultItemHl:''}`}>
            <span className={styles.releaseTitle}>{_.title}
              <span className={styles.releaseCountry}>{isCountryNeeded() && _.country ? `(${_.country})` : ``}</span>
            </span>
            <span className={styles.releaseDate}>{_.date?.substr(0,4)}</span>
          </div>
          )}
        </div>
        {showFilterConfig ?
        <div className={`modal is-active`}>
          <div className={`modal-background`}></div>
          <div className={`modal-content ${styles.countryModal}`}>
            <FilterConfig countries={countries} userCountries={userCountries} handleChange={handleCountryChange} persistChange={persistCountryChanges}></FilterConfig>
          </div>
          <button className={`modal-close is-large`} aria-label="close" onClick={handleCloseClick}></button>
        </div>
        :
        <></>
        }
      </>
      :
      <></>
      }
    </div>
  )
}