import styles from '../styles/ResultSectionHeader.module.scss'
import pluralize from '../lib/plurals'

export default function ResultSectionHeader({type1, type2, i}) {
  const _type1 = type1 || type2 ? type1 : '?'
  const text = [type2, pluralize(_type1 ?? '')].join(' ').trim()
  return <h2 className={styles.header} id={`group_${i}`}>{text}</h2>
}