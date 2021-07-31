import React,{ useState } from 'react'
import Image from 'next/image'
import styles from '../styles/ResultBlock.module.scss'
import modalStyles from  '../styles/Modal.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faSadTear, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export default function CoverArt({imgUrlLarge, showLargeImg, handleCloseClick}) {

  const [isImgLoading, setIsImgLoading] = useState(true)
  const [imgErrored, setImgErrored] = useState(false)

  const handleOnLoad = function() {
    setTimeout(() => setIsImgLoading(false), 500)
  }

  const handleError = function() {
    setIsImgLoading(false)
    setImgErrored(true)
  }

  return(
    <>
    { showLargeImg &&
      <div className={`${modalStyles.modal} ${modalStyles.isActive}`}>
        <div className={modalStyles.modalBackground} onClick={handleCloseClick}></div>
        <div className={modalStyles.modalContent}>
        {!imgErrored &&
        <a
          onClick={handleCloseClick}
          className={`${isImgLoading && styles.largeCoverArtHidden}`}>
          <Image
            onLoad={handleOnLoad}
            src={imgUrlLarge}
            className={`${isImgLoading && styles.largeCoverArtHidden}`}
            width={640} height={640}
            objectFit="scale-down"
            alt="Album Art"
            onError={handleError} />
        </a>
        }
        {!imgErrored && isImgLoading &&
        <div onClick={handleCloseClick} className={styles.largeCoverArtLoading}>
          <FontAwesomeIcon
            className={styles.resultBlockLoadingIcon}
            icon={faSpinner}
            pulse
          />
        </div>
        }
        {imgErrored &&
        <div onClick={handleCloseClick} className={styles.largeCoverArtLoading}>
          <div className={styles.largeCoverArtError}>
            <FontAwesomeIcon
              className={styles.resultBlockLoadingIcon}
              icon={faExclamationTriangle}
            />
            <FontAwesomeIcon
              className={styles.resultBlockLoadingIcon}
              icon={faSadTear}
              fontSize="larger"
            />
            <FontAwesomeIcon
              className={styles.resultBlockLoadingIcon}
              icon={faExclamationTriangle}
              fontSize="smaller"
            />
          </div>
          <div>Failed to load cover.</div>
        </div>
        }
        </div>
      </div>
    }
    </>
  )
}