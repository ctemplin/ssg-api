import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSadTear, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/NetworkError.module.scss'

export default function NetworkError({errorMsg, style}) {
  return (
    <div className={styles.container}>
      <div className={styles.icons} style={{...style}}>
        <FontAwesomeIcon
        className={styles.errorIcon}
        icon={faExclamationTriangle}
        />
        <FontAwesomeIcon
        className={styles.errorIcon}
        icon={faSadTear}
        fontSize="larger"
        />
        <FontAwesomeIcon
        className={styles.errorIcon}
        icon={faExclamationTriangle}
        fontSize="smaller"
        />
      </div>
      {errorMsg && <div>{errorMsg}</div>}
    </div>
    )
  }