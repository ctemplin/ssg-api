import Image from 'next/image'
import styles from '../styles/About.module.sass'

export default function toolLogo(props) {
  const { src, alt, width, height, hasBorder, color } = {...props}
  
  const classNames = () => {
    const ret = [styles.logo]
    ret.push(hasBorder ? styles.logoBorder : '')
    ret.push(styles[color] ?? '')
    return ret.join(' ').trim()
  }
  return (
    <div className={styles.toolLogo}>
      {/* Wrapper div/class allows responsive image to work with flex-box
          yet remain fixed-sized in desktop mode. */}
      <div className={styles.logoWrapper}>
        <Image
          src={src} layout="intrinsic" alt={alt} width={width} height={height} 
          className={classNames()} />
      </div>
    </div>
    )
  }