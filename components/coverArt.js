import React,{useEffect, useState} from 'react'
import Image from 'next/image'
import styles from '../styles/ResultBlock.module.scss'

export default function CoverArt({id, width=200, height=200, showLargeImg, handleCoverArtSmall, handleCloseClick}) {

  const [imgUrlSmall, setImgUrlSmall] = useState()
  const [imgUrlLarge, setImgUrlLarge] = useState()

  useEffect(() =>  {
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

  return(
    <>
    { imgUrlLarge && showLargeImg ?
    <a onClick={handleCloseClick}><Image src={imgUrlLarge} className={styles.largeCoverArt} layout="fill" objectFit="scale-down" alt="Album Art"/></a>
    :
    <></>
    }
    </>
  )
}