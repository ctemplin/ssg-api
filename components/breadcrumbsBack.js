import { useRecoilValue, useSetRecoilState } from 'recoil'
import { prevBreadcrumbsAtom, breadcrumbsSel } from '../models/musicbrainz'
import styles from '../styles/BreadcrumbsBack.module.scss'

export default function BreadcrumbsBack() {

  const prevBreadcrumbs = useRecoilValue(prevBreadcrumbsAtom)
  const restorePreviousView = useSetRecoilState(breadcrumbsSel)
  const handleClick = () => restorePreviousView()

  return (
    <>
    {prevBreadcrumbs?.[0]?.id &&
    <span className={styles.crumbs}>
      <span>| Return to: </span>
      {prevBreadcrumbs.map((_, i, arr) =>
        <>
        <a key={_.id} onClick={handleClick} >{_.label}</a>
        {i < arr.length -1 && <span> - </span>}
        </>
      )}
    </span>
    }
    </>
  )
}