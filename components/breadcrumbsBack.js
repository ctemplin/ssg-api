import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import { previousUrlAtom, currentArtistAtom } from '../pages/_app'
import { useRouter } from 'next/router'
import styles from '../styles/BreadcrumbsBack.module.scss'

export default function BreadcrumbsBack() {

  const previousUrl = useRecoilValue(previousUrlAtom)
  const resetPreviousUrl = useResetRecoilState(previousUrlAtom)
  const setCurrentArtist = useSetRecoilState(currentArtistAtom)
  const router = useRouter()

  const handleClick = () => {
    const breadcrumbUrl = previousUrl.url
    resetPreviousUrl()
    router.push(breadcrumbUrl, breadcrumbUrl, {shallow: true})
  }

  return (
    <>
    {previousUrl.url &&
    <span className={styles.line}>
      <span>| Return to:</span> <a onClick={handleClick} >{previousUrl.strings[0]}</a>
    </span>
    }
    </>
  )

}