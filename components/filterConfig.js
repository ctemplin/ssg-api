import {useState} from 'react'
import { useRecoilValue } from 'recoil'
import { userCountriesAtom, releaseGroupCountries } from '../models/musicbrainz'
import styles from '../styles/FilterConfig.module.scss'

export default function FilterConfig({handleChange, persistChange, handleClose}){

  const userCountries = useRecoilValue(userCountriesAtom)
  const countries = useRecoilValue(releaseGroupCountries)
  const [isChanged, setIsChanged] = useState(false)

  const handleCheckboxChange = function(e) {
    setIsChanged(true)
    handleChange(e)
  }

  return (
    <div role="list" className={styles.container}>
      Countries
      {Array.from(countries).sort().map(_ =>
      <label role="listitem" key={_} className={styles.row}>
        <span className={styles.abbrev}>{_}</span>
        <input
          type="checkbox"
          name={_}
          onChange={handleCheckboxChange}
          checked={userCountries.has(_)}
          className={styles.cb}
        />
      </label>
    )}
    <div className={styles.footer}>
    {(persistChange && isChanged) ?
    <>
      <span className={styles.message}>The release list was updated.</span><br/>
      <a className={styles.link} onClick={handleClose}>
        close
      </a> / <a className={styles.link} onClick={persistChange}>save and close</a>
    </>
    :
      <a className={styles.link} onClick={handleClose}>close</a>
    }
    </div>
    </div>
  )
}