import { Fragment } from 'react'
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
      return {"flexGrow": i*2}
    }

    return (
      <>
      {include(i,arr.length) &&
      <Fragment key={_.id}>
      <a onClick={handleClick} className={styles.crumb} style={style(i)}>{_.label}</a>
      {i < arr.length -1 && <span className={styles.separator}> - </span>}
      </Fragment>
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