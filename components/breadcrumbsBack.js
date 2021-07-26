import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import {
  prevBreadcrumbsAtom, currentArtistAtom,
  currentReleaseGroupAtom, currentReleaseAtom, prevItems
} from '../pages/_app'
import styles from '../styles/BreadcrumbsBack.module.scss'

export default function BreadcrumbsBack() {

  const prevBreadcrumbs = useRecoilValue(prevBreadcrumbsAtom)
  const resetPreviousBreadcrumbs = useResetRecoilState(prevBreadcrumbsAtom)
  const getPrevItems = useRecoilValue(prevItems)
  const setArtist = useSetRecoilState(currentArtistAtom)
  const setReleaseGroup = useSetRecoilState(currentReleaseGroupAtom)
  const setRelease = useSetRecoilState(currentReleaseAtom) 

  const handleClick = (id) => {
    return () => {
      resetPreviousBreadcrumbs()
      setArtist(getPrevItems.artist)
      setReleaseGroup(getPrevItems.releaseGroup)
      setRelease(getPrevItems.release)
    }
  }

  return (
    <>
    {prevBreadcrumbs?.[0]?.id &&
    <span className={styles.crumbs}>
      <span>| Return to: </span>
      {prevBreadcrumbs.map((_, i, arr) =>
        <>
        <a key={_.id} onClick={handleClick(_.id)} >{_.label}</a>
        {i < arr.length -1 && <span> - </span>}
        </>
      )}
    </span>
    }
    </>
  )

}