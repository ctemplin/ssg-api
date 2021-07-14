import styles from '../styles/RecordingThumb.module.scss'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faCircle } from '@fortawesome/free-solid-svg-icons'

export default function RecordingThumb({videoId, title, imgSrc, imgWidth, imgHeight}) {
  
  return (
    <div className={styles.resultItem} key={videoId}>
      <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer">
      {imgSrc &&
        <>
        <Image src={imgSrc} width={imgWidth} height={imgHeight} alt={title} />
        <span className={styles.videoIcon} >
        <FontAwesomeIcon
           className={styles.videoIconLayer} 
          icon={faCircle}
          width={30}
          height={30}
          color="#FFF"
        />
        <FontAwesomeIcon
         className={styles.videoIconLayer} 
          icon={faPlayCircle}
          width={30}
          height={30}
          color="#F00"
        />
        </span>
        </>
      }
      </a>
      <div dangerouslySetInnerHTML={{__html: title}}></div>
    </div>
    )
  }