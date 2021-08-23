import Image from 'next/image'
import styles from '../styles/AppHistory.module.sass'

export default function toolLogo(props) {
  const {src, alt, width, height} = {...props}
  
  return (
    <div className={styles.toolLogo}>
      {/* Wrapper div/class allows responsive image to work with flex-box
          yet remain fixed-sized in desktop mode. */}
      <div className={styles.logoWrapper}>
        <Image
          src={src} className={styles.logo}
          layout="intrinsic" alt={alt}
          width={width} height={height} />
      </div>
    </div>
    )
  }