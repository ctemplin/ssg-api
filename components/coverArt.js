import React,{useEffect, useState} from 'react'
import Image from 'next/image'
import styles from '../styles/ResultBlock.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function CoverArt({id, width=200, height=200, showLargeImg, handleCoverArtSmall, handleCloseClick}) {

  const [imgUrlSmall, setImgUrlSmall] = useState()
  const [imgUrlLarge, setImgUrlLarge] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() =>  {
    setIsLoading(true)
    async function getData() {
      const resp = await fetch(
        'https://coverartarchive.org/release/' + id,
        {
          headers: {"Accept": "application/json"}
        }
      )
      const json = await resp.json()
      setImgUrlSmall(json.images?.[0]?.thumbnails?.small?.replace(/^http[^s]:/, 'https:'))
      setImgUrlLarge(json.images?.[0]?.image.replace(/^http[^s]:/, 'https:'))
    }
    getData()
  },[id])

  useEffect(() => {
    handleCoverArtSmall(imgUrlSmall)
  }, [imgUrlSmall, handleCoverArtSmall])

  const handleOnLoad = function() {
    setTimeout(() => setIsLoading(false), 500)
  }

  return(
    <>
    { showLargeImg ?
      <>
        <a onClick={handleCloseClick}><Image onLoad={handleOnLoad} src={imgUrlLarge} className={`${styles.largeCoverArt} ${isLoading ? styles.largeCoverArtHidden : ''}`} layout="fill" objectFit="scale-down" alt="Album Art"/></a>
      {isLoading ?
      <div onClick={handleCloseClick} className={styles.largeCoverArtLoading}>
        <FontAwesomeIcon
          className={styles.resultBlockLoadingIcon}
          icon={faSpinner}
          pulse
        />
      </div>
      :
      <></>
      }
      </>
    :
      <></>
    }
    </>
  )
}