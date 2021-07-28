import { useRecoilValue, useSetRecoilState } from 'recoil'
import { prevBreadcrumbsAtom, breadcrumbsSel } from '../models/musicbrainz'
import styles from '../styles/BreadcrumbsBack.module.scss'

export default function BreadcrumbsBack() {

  const prevBreadcrumbs = useRecoilValue(prevBreadcrumbsAtom)
  const restorePreviousView = useSetRecoilState(breadcrumbsSel)
  const handleClick = () => restorePreviousView()

  function breadcrumbOrNot(_, i, arr) {
    const include = (i,l) => {
      return (i == 0 || i == l-1)
    }

    const style = (i) => {
      return {"flex-grow": i*2}
    }

    return (
      <>
      {include(i,arr.length) && 
      <>
      <a key={_.id} onClick={handleClick} className={styles.crumb} style={style(i)}>{_.label}</a>
      {i < arr.length -1 && <span className={styles.separator}> - </span>}
      </>
      }
      </>
    )
  }

  return (
    <>
    {prevBreadcrumbs?.[0]?.id &&
    <>
      <span className={styles.leadIn}>| Return to:</span>
      {prevBreadcrumbs.map(breadcrumbOrNot)}
    </>
    }
    </>
  )
}