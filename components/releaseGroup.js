import React,{ useState, useEffect, useRef } from 'react'
import { useCookies } from 'react-cookie'
import { useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil'
import {
  userCountriesAtom, releaseGroupCountries,
  releaseGroupUserCountryMatch, releaseGroupFilteredReleases,
  currentReleaseAtom, newDefaultsWithProps } from '../models/musicbrainz'
import { currentReleaseCoverArtAtom } from '../models/coverartartchive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompactDisc, faFilter } from '@fortawesome/free-solid-svg-icons'
import FilterConfig from './filterConfig'
import styles from '../styles/ResultBlock.module.scss'
import modalStyles from '../styles/Modal.module.scss'

export default function ReleaseGroup({dispData}) {

  const [cookies, setCookie] = useCookies()
  const resetRelease = useResetRecoilState(currentReleaseAtom)
  const [currentRelease, setCurrentRelease] = useRecoilState(currentReleaseAtom)
  const [userCountries, setUserCountries] = useRecoilState(userCountriesAtom)
  const [showFilterConfig, setShowFilterConfig] = useState(false)
  const rgCountries = useRecoilValue(releaseGroupCountries)
  const anyCountryMatch = useRecoilValue(releaseGroupUserCountryMatch)
  const filteredReleases = useRecoilValue(releaseGroupFilteredReleases(anyCountryMatch))

  useEffect(() => {
    if (cookies.countries) {setUserCountries(new Set(cookies.countries))}
  },[])

  const handleClick = (id, title, country, date, i) => {
    return () => {
      setCurrentRelease(newDefaultsWithProps(
        currentRelease, {id: id, title: title, country: country, date: date}
      ))
    }
  }

  useEffect(() => {
    resetRelease()
  },[dispData.id])

  useEffect(() => {
    head.current?.scrollIntoView({behavior: "smooth"})
  },[dispData?.id])

  const handleFilterClick = (e) => {
    if (dispData.releases.length > 1) {
      setShowFilterConfig(true)
    }
  }

  const handleCountryChange = (e) => {
    const target = e.target
    if (target.checked) {
      setUserCountries(new Set(userCountries.add(target.name)))
    } else {
      let del = userCountries.delete(target.name)
      if (del) {
        setUserCountries(new Set(userCountries))
      }
    }
  }

  const persistCountryChanges = () => {
    // Combine previously saved countries with currently relevant one
    var allCountries = Array.from(rgCountries).concat(cookies.countries ?? [])
    // Keep countries that are not currently relevant, or relevant and chosen
    allCountries = allCountries.filter(
      _ => (!rgCountries.has(_)) || rgCountries.has(_) && userCountries.has(_)
    )
    setCookie("countries", Array.from(new Set(allCountries)), {path: '/'})
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
    if ((userCountries.size == 1) ||
        (userCountries.size == 2 && userCountries.has("??"))
       )
       // Too little country variety to clutter the UI with
       return false
    // Showing releases from a mix of countries
    return true
  }

  const releasesScrollable = useRef()
  const head = useRef()

  if (!dispData.id) { return null }
  return (
    <div ref={head} className={styles.block}>
      <div>
        <div className={styles.blockType}>Release</div>
        <div className={styles.blockHeader}>
          <span className={styles.blockHeaderTitle}>{dispData.title}</span>
          <FontAwesomeIcon
          className={styles.resultHeaderIcon}
          height="1.3em"
          icon={faCompactDisc}
          />
        </div>
        <div className={styles.blockHeaderDate}>{dispData.firstReleaseDate}</div>
      </div>
      {dispData.releases &&
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
          <span>Versions: {dispData.releases.length - filteredReleases.length} filtered out</span>
        </div>
        <div className={styles.resultsList} ref={releasesScrollable}>
          {filteredReleases.map((_,i) =>
          <div
            onClick={handleClick(_.id, _.title, _.country, _.date, i)}
            key={_.id}
            className={`
              ${i % 2 ? styles.resultItemAlt : styles.resultItem}
              ${_.id == currentRelease.id ? styles.resultItemHl:''}
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
            <FilterConfig
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