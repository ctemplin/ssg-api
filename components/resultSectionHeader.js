import styles from '../styles/ResultSectionHeader.module.scss'
import pluralize from '../lib/plurals'

export default function ResultSectionHeader({curItem, prevItem, fieldNames}) {
    const ret = []
    const anyChange = !prevItem || fieldNames.some(fn => curItem[fn] != prevItem[fn])
    if (anyChange) {
        let prime = curItem[fieldNames[0]]
        let sec = curItem[fieldNames[1]]
        prime = prime || sec ? prime : '?'
        ret.push(
            <div className={styles.header} key={`${sec}-${prime}`}>{[
                sec,
                pluralize(prime ?? '')
            ].join(' ').trim()}</div>
        )
    }
    return ret.length ? ret : null
}