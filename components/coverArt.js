import React,{useEffect, useState} from 'react'
import Image from 'next/image'
import styles from '../styles/ResultBlock.module.scss'
import modalStyles from  '../styles/Modal.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faSadTear, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export default function CoverArt({id, showLargeImg, handleCoverArtSmall, handleCloseClick}) {

  const [imgUrlSmall, setImgUrlSmall] = useState()
  const [imgUrlLarge, setImgUrlLarge] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() =>  {
    setIsLoading(true)
    setIsError(false)
    async function getData() {
      const resp = await fetch(
        'https://coverartarchive.org/release/' + id,
        {
          headers: {"Accept": "application/json"}
        }
      )
      const json = await resp.json()
      let preferredImage = json.images?.find(_ => _.front == true)
      preferredImage = preferredImage ?? json.images?.[0]
      if (preferredImage) {
        setImgUrlSmall(preferredImage.thumbnails?.small?.replace(/^http[^s]:/, 'https:'))
        setImgUrlLarge(preferredImage.image.replace(/^http[^s]:/, 'https:'))
      }
    }
    getData()
  },[id])

  useEffect(() => {
    handleCoverArtSmall(imgUrlSmall)
  }, [imgUrlSmall, handleCoverArtSmall])

  const handleOnLoad = function() {
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleError = function() {
    setIsLoading(false)
    setIsError(true)
  }

  return(
    <>
    { showLargeImg ?
      <div className={`${modalStyles.modal} ${modalStyles.isActive}`}>
        <div className={modalStyles.modalBackground} onClick={handleCloseClick}></div>
        <div className={modalStyles.modalContent}>
        {!isError &&
        <a onClick={handleCloseClick} className={`${isLoading && styles.largeCoverArtHidden}`}><Image onLoad={handleOnLoad} src={imgUrlLarge} className={`${isLoading && styles.largeCoverArtHidden}`} width={640} height={640} objectFit="scale-down" alt="Album Art" onError={handleError}/></a>
        }
        {!isError && isLoading &&
        <div onClick={handleCloseClick} className={styles.largeCoverArtLoading}>
          <FontAwesomeIcon
            className={styles.resultBlockLoadingIcon}
            icon={faSpinner}
            pulse
          />
        </div>
        }
        {isError &&
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
    :
      <></>
    }
    </>
  )
}