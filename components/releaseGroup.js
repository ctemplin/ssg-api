import React,{useState, useEffect, useRef, useMemo} from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { currentReleaseGroupAtom, currentReleaseAtom } from '../models/musicbrainz'
import useAsyncReference from '../lib/asyncReference'
import {useCookies} from 'react-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompactDisc, faFilter } from '@fortawesome/free-solid-svg-icons'
import FilterConfig from './filterConfig'
import styles from '../styles/ResultBlock.module.scss'
import modalStyles from '../styles/Modal.module.scss'
import formatDate from '../lib/dates'

export default function ReleaseGroup({id}) {

  const [data, setData] = useRecoilState(currentReleaseGroupAtom)
  const setCurrentRelease = useSetRecoilState(currentReleaseAtom)
  const [hlRef, setHlRef] = useState()
  const [cookies, setCookie] = useCookies()
  const defaultCountries = useMemo(() => cookies.countries || ["US", "??"], [id])
  const [userCountries, setUserCountries] = useAsyncReference(new Set(defaultCountries))
  const [rgCountries, setRgCountries] = useState()
  const [anyCountryMatch, setAnyCountryMatch] = useState(true)
  const [showFilterConfig, setShowFilterConfig] = useState(false)

  useEffect(() => {
    setHlRef()
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
        const firstReleaseDate = formatDate(json['first-release-date'])
        const _countries = new Set()
        setData(
          {
            ...data,
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
        setRgCountries(_countries)
        let _anyCountryMatch = defaultCountries.filter(
          _ => Array.from(_countries).includes(_)
        ).length != 0
        if (!_anyCountryMatch) {
          setUserCountries(new Set(Array.from(_countries)))
        }
        setAnyCountryMatch(_anyCountryMatch)
    }
    id && getData()
    const listDiv = releasesScrollable.current
    if (listDiv) listDiv.scrollTop = 0
  },[id, defaultCountries, setRgCountries])

  useEffect(() => {
    // Remove any trailing null array items from previous render
    releaseEls.current = releaseEls.current.filter(_=>_)
    // If we're left with only 1 result, virtually click it
    if (releaseEls?.current.length == 1) {
      // releaseEls.current[0].click()
    }
  },[data.releases])

  const handleClick = (id, title, country, date, i) => {
    return () => {
      setHlRef(releaseEls.current[i])
      setCurrentRelease({id: id, title: title, country: country, date: date})
    }
  }

  const countryFilter = anyCountryMatch ?
    (_,i,a) => a.length == 1 || userCountries.current.has(_.country)
    :
    (_,i,a) => true

  useEffect(() => {
    head.current?.scrollIntoView({behavior: "smooth"})
  },[data.id])

  const handleFilterClick = (e) => {
    if (data.releases.length > 1) {
      setShowFilterConfig(true)
    }
  }

  const handleCountryChange = (e) => {
    const target = e.target
    if (target.checked) {
      setUserCountries(new Set(userCountries.current.add(target.name)))
    } else {
      let del = userCountries.current.delete(target.name)
      if (del) {
        setUserCountries(new Set(userCountries.current))
      }
    }
  }

  const persistCountryChanges = () => {
    // Combine previously saved countries with currently relevant one
    var allCountries = Array.from(rgCountries).concat(cookies.countries ?? [])
    // Keep countries that are not currently relevant, or relevant and chosen
    allCountries = allCountries.filter(
      _ => (!rgCountries.has(_)) || rgCountries.has(_) && userCountries.current.has(_)
    )
    setCookie("countries", Array.from(new Set(allCountries)))
    setShowFilterConfig(false)
  }

  const handleCloseClick = () => {
    setShowFilterConfig(false)
  }

  const isCountryNeeded = () => {
    if (anyCountryMatch == false)
      // No releases can pass country filter,
      // so show them all and make that clear.
      return true
    if ((userCountries.current.size == 1) ||
        (userCountries.current.size == 2 && userCountries.current.has("??"))
       )
       // Too little country variety to clutter the UI with
       return false
    // Showing releases from a mix of countries
    return true
  }

  const releasesScrollable = useRef()
  const releaseEls = useRef([])
  const head = useRef()

  const filteredReleases = data.releases?.filter(countryFilter)
  return (
    <div ref={head} className={styles.block}>
      <div>
        <div className={styles.blockType}>Release</div>
        <div className={styles.blockHeader}>
          <span className={styles.blockHeaderTitle}>{data.title}</span>
          <FontAwesomeIcon
          className={styles.resultHeaderIcon}
          height="1.3em"
          icon={faCompactDisc}
          />
        </div>
        <div className={styles.blockHeaderDate}>{data.firstReleaseDate}</div>
      </div>
      {data.releases &&
      <>
        <div className={styles.countFilter}>
          <FontAwesomeIcon
            className={`
              ${filteredReleases.length > 1 ? 
                styles.resultUtilIcon : styles.resultUtilIconDisabled}
            `}
            height="1.3em"
            icon={faFilter}
            onClick={handleFilterClick}
          />
          <span>Versions: {data.releases.length - filteredReleases.length} filtered out</span>
        </div>
        <div className={styles.resultsList} ref={releasesScrollable}>
          {filteredReleases.map((_,i) =>
          <div
            onClick={handleClick(_.id, _.title, _.country, _.date, i)}
            key={_.id}
            ref={(el) => releaseEls.current[i] = el}
            className={`
              ${i % 2 ? styles.resultItemAlt : styles.resultItem}
              ${hlRef && hlRef==releaseEls.current[i]?styles.resultItemHl:''}
            `}
          >
            <span className={styles.releaseTitle}>{_.title}
              <span className={styles.releaseCountry}>
                {isCountryNeeded() && _.country ? `(${_.country})` : ``}
              </span>
            </span>
            <span className={styles.releaseDate}>{_.date?.substr(0,4)}</span>
          </div>
          )}
        </div>
        {showFilterConfig &&
        <div className={`${modalStyles.modal} ${modalStyles.isActive}`}>
          <div className={modalStyles.modalBackground}></div>
          <div className={`${modalStyles.modalContent} ${styles.countryModal}`}>
            <FilterConfig countries={rgCountries} userCountries={userCountries}
              handleChange={handleCountryChange}
              persistChange={persistCountryChanges}
              handleClose={handleCloseClick}
              anyCountryMatch={anyCountryMatch} />
          </div>
        </div>
        }
      </>
      }
    </div>
  )
}