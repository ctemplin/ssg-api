import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userCountriesAtom, releaseGroupCountries } from '../models/musicbrainz'
import styles from '../styles/FilterConfig.module.scss'

export default function FilterConfig({handleChange, persistChange, handleClose, show}){

  const userCountries = useRecoilValue(userCountriesAtom)
  const countries = useRecoilValue(releaseGroupCountries)
  const [isChanged, setIsChanged] = useState(false)

  const handleCheckboxChange = function(e) {
    setIsChanged(true)
    handleChange(e)
    persistChange()
  }

  return (
    <div role="dialog" className={`${styles.container} ${show ? '' : styles.hidden}`}>
      <div className={styles.header}>
        <span>Countries</span>
      </div>
      <div role="list" className={`${styles.list}`}>
        {Array.from(countries).sort().map(_ =>
        <label role="listitem" key={_} className={styles.listitem}>
          <input
            type="checkbox"
            name={_}
            onChange={handleCheckboxChange}
            checked={userCountries.has(_)}
            className={styles.cb}
          />
          <span className={styles.abbrev}>{_}</span>
        </label>
        )}
      </div>
    <div className={styles.footer}>
    </div>
    </div>
  )
}