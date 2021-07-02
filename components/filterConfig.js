import styles from '../styles/FilterConfig.module.scss'

export default function FilterConfig({countries, userCountries, handleChange}) {

  return (
    <div className={styles.container}>
      Countries:
      {Array.from(countries).map(_ => 
      <>
      <label className={styles.row}>
        <span className={styles.abbrev}>{_}</span>
        <input
          type="checkbox"
          key={_}
          name={_}
          onChange={handleChange}
          checked={userCountries.has(_)}
        />
      </label>
      </>
    )}
    </div>
  )
}