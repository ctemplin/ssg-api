import styles from '../styles/ResultSectionHeader.module.scss'

export default function ResultSectionHeader({curItem, prevItem, fieldName}) {
    const ret = []
    if (curItem[fieldName] != prevItem[fieldName]) {
        let pluralType = curItem[fieldName] + ((curItem[fieldName] == 'other') ? '' : 's')
        ret.push(
            <div className={styles.header}>{pluralType}</div>
        )
    }
    return ret
}