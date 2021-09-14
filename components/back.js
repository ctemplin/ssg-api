import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/Toolbar.module.scss'

export default function back(props) {
const { ariaLabel, icon, handleClick, className="toolbar" } = {...props}

  return (
    <Link href={handleClick ? {} : "/"} >
      <a className={`${styles[className]}`} aria-label={ariaLabel} 
        onClick={handleClick ? handleClick : null } >
        <FontAwesomeIcon
          height="1em"
          className={styles.icon}
          icon={faArrowLeft} />
        <FontAwesomeIcon
          height="1em"
          className={styles.icon}
          icon={icon} />
      </a>
    </Link>
    )
  }