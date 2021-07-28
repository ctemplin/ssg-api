import React,{useState, useEffect, useRef, useMemo} from 'react'
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import { 
  releaseGroupLookup, currentReleaseGroupAtom, currentReleaseGroupPanelFormat,
  releaseGroupCountries, currentReleaseAtom, releaseGroupFilteredReleases
  } from '../models/musicbrainz'
import useAsyncReference from '../lib/asyncReference'
import {useCookies} from 'react-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompactDisc, faFilter } from '@fortawesome/free-solid-svg-icons'
import FilterConfig from './filterConfig'
import styles from '../styles/ResultBlock.module.scss'
import modalStyles from '../styles/Modal.module.scss'

export default function ReleaseGroup({id}) {

  const setCurrentRelease = useSetRecoilState(currentReleaseAtom)
  const [hlRef, setHlRef] = useState()
  const [errored, setErrored] = useState(false)
  const [cookies, setCookie] = useCookies()
  const defaultCountries = useMemo(() => cookies.countries || ["US", "??"], [id])
  const [userCountries, setUserCountries] = useAsyncReference(new Set(defaultCountries))
  const [anyCountryMatch, setAnyCountryMatch] = useState(true)
  const [showFilterConfig, setShowFilterConfig] = useState(false)
  const rgCountries = useRecoilValue(releaseGroupCountries)
  const setCurrentReleaseGroup = useSetRecoilState(currentReleaseGroupAtom)
  const data = useRecoilValue(currentReleaseGroupPanelFormat)
  const filteredReleases = useRecoilValue(releaseGroupFilteredReleases(anyCountryMatch, userCountries))
  const fetchData = useRecoilValueLoadable(releaseGroupLookup(id))

  useEffect(() => {
    switch (fetchData.state) {
      case 'loading':
        break;
      case 'hasValue':
        setCurrentReleaseGroup(fetchData.contents)
        let _anyCountryMatch = defaultCountries.filter(
          _ => Array.from(rgCountries).includes(_)
        ).length != 0
        if (!_anyCountryMatch) {
          setUserCountries(new Set(Array.from(rgCountries)))
        }
        setAnyCountryMatch(_anyCountryMatch)
        setErrored(false)
        break;
      case 'hasError':
        console.log(data.contents)
        setErrored(true)
      default:
        break;
    }
  },[fetchData.state])

  const handleClick = (id, title, country, date, i) => {
    return () => {
      setHlRef(releaseEls.current[i])
      setCurrentRelease({id: id, title: title, country: country, date: date})
    }
  }

  useEffect(() => {
    head.current?.scrollIntoView({behavior: "smooth"})
  },[data?.id])

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