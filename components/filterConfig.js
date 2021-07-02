import {useState} from 'react'
import styles from '../styles/FilterConfig.module.scss'

export default function FilterConfig({countries, userCountries, handleChange, persistChange}) {

  const [isChanged, setIsChanged] = useState(false)

  const handleCheckboxChange = function(e) {
    setIsChanged(true)
    handleChange(e)
  }

  return (
    <div className={styles.container}>
      Countries:
      {Array.from(countries).sort().map(_ =>
      <>
      <label key={_} className={styles.row}>
        <span className={styles.abbrev}>{_}</span>
        <input
          type="checkbox"
          name={_}
          onChange={handleCheckboxChange}
          checked={userCountries.has(_)}
        />
      </label>
      </>
    )}
    {(persistChange && isChanged) ?
    <>
    <span className={styles.message}>This release list was updated.</span>
    <a className={styles.link} onClick={persistChange}>persist changes</a>
    </>
    :
    <></>
    }
    </div>
  )
}