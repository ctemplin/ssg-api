import { useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userCountriesAtom, releaseGroupCountries } from '../models/musicbrainz'
import styles from '../styles/FilterConfig.module.scss'

export default function FilterConfig({handleChange, persistChange, isVisible}){

  const [userCountries, setUserCountries] = useRecoilState(userCountriesAtom)
  const countries = useRecoilValue(releaseGroupCountries)

  const isAllActionAdditive = useMemo(() => {
      let userRgCountries = Array.from(userCountries).filter(_ => countries.has(_))
      return userRgCountries.length < countries.size/2
    },
    [userCountries, countries]
  )

  useEffect(() => {
    persistChange()
  }, [userCountries])

  const handleAllChange = function(e) {
    isAllActionAdditive ?
      setUserCountries(new Set(Array.from(userCountries).concat(Array.from(countries))))
    :
      setUserCountries(new Set(Array.from(userCountries).filter(_ => !countries.has(_))))
  }

  return (
    <div role="dialog" className={`${styles.container} ${isVisible ? '' : styles.hidden}`}>
      <div className={styles.header}>
        <span>Countries</span>
      </div>
      <div role="list" className={`${styles.list}`}>
        <label className={styles.listitemAll}>
          <input
            type="checkbox"
            name="allOrNone"
            checked={!isAllActionAdditive}
            disabled={false}
            className={styles.cb}
            onChange={handleAllChange}
          />All
        </label>
        {Array.from(countries).sort().map(_ =>
        <label role="listitem" key={_} className={styles.listitem}>
          <input
            type="checkbox"
            name={_}
            onChange={handleChange}
            checked={userCountries.has(_)}
            className={styles.cb}
          />{_}
        </label>
        )}
      </div>
    <div className={styles.footer}>
    </div>
    </div>
  )
}