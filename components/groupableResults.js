import React, { Fragment } from 'react'
import ResultSectionHeader from './resultSectionHeader'
import { extractYear } from '../lib/dates'
import styles from '../styles/ResultBlock.module.scss'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentReleaseGroupAtom, resetThenSetValue} from '../models/musicbrainz'

export default function GroupableResults({props, i}) {
  const currentReleaseGroup = useRecoilValue(currentReleaseGroupAtom)
  const resetThenSet = useSetRecoilState(resetThenSetValue)

  function handleClick(id, title) {
    return () => {
      resetThenSet({atom: currentReleaseGroupAtom, id: id, title: title})
    }
  } 

  const GroupedItems = ({items, i}) => 
  <div key={`${items[0].id}`} role="group" aria-labelledby={`group_${i}`}>
    <ResultSectionHeader type1={items[0].type1} type2={items[0].type2} i={i} />
    <ItemList items={items} />
  </div>

  const ItemList = ({items}) => 
  items.map((item,i) => <SingleItem item={item} i={i} key={item.id ?? i}/>)

  const SingleItem = ({item, i}) => 
  <Fragment key={`${item.id}`}>
  <div onClick={handleClick(item.id, item.title)} role="listitem"
    className={`
      ${i % 2 ? styles.resultItemAlt : styles.resultItem}
      ${item.id == currentReleaseGroup.id ? styles.resultItemHl:''}
    `}
  >
    <span className={styles.releaseTitle}>{item.title}</span>
    <span className={styles.releaseDate}>
      {extractYear(item.firstReleaseDate) ?? ''}
    </span>
  </div>
  </Fragment>

  return (
    (props.length && (props instanceof Array)
    ?
      <GroupedItems items={props} i={i} />
    :
      <SingleItem item={props} i={i} />
    )
  )
}
