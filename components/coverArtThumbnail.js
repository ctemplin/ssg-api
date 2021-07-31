import { useState } from 'react'
import Image from 'next/image'
import CoverArt from './coverArt'
import styles from '../styles/ResultBlock.module.scss'

export default function CoverArtThumbnail({dispData}) {

  const [showLargeImg, setShowLargeImg] = useState(false)

  const toggleImgModal = (e) => {
    setShowLargeImg(!showLargeImg)
  }

  return(
    <>
    <a onClick={toggleImgModal}>
      {dispData.imgUrlSmall ?
      <Image
        src={dispData.imgUrlSmall}
        width={60} height={60}
        layout="fixed" alt="Album Art Thumbnail"
        className={styles.resultHeaderImage}/>
      :
      <Image
        src='/cover-art-placeholder.svg'
        width={60} height={60}
        layout="fixed" alt="Album Art Thumbnail"
        className={styles.resultHeaderImage}/>
      }
    </a>
    {dispData.imgUrlLarge &&
      <CoverArt
        imgUrlLarge={dispData.imgUrlLarge}
        showLargeImg={showLargeImg}
        handleCloseClick={toggleImgModal}
      />
    }
    </>
  )
}