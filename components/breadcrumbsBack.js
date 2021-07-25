import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import { prevBreadcrumbsAtom, currentArtistAtom } from '../pages/_app'
import styles from '../styles/BreadcrumbsBack.module.scss'

export default function BreadcrumbsBack() {

  const prevBreadcrumbs = useRecoilValue(prevBreadcrumbsAtom)
  const resetPreviousBreadcrumbs = useResetRecoilState(prevBreadcrumbsAtom)
  const setCurrentArtist = useSetRecoilState(currentArtistAtom)

  const handleClick = () => {
    const prevArtist = prevBreadcrumbs[0]
    resetPreviousBreadcrumbs()
    setCurrentArtist(prevArtist)
  }

  return (
    <>
    {prevBreadcrumbs?.[0].id &&
    <span className={styles.crumbs}>
      <span>| Return to: </span>
      <a onClick={handleClick} >{prevBreadcrumbs?.[0]?.name}</a>
    </span>
    }
    </>
  )

}