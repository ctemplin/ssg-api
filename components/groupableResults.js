import React, { Fragment } from 'react'
import ResultSectionHeader from './resultSectionHeader'
import { extractYear } from '../lib/dates'
import styles from '../styles/ResultBlock.module.scss'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentReleaseGroupAtom, resetThenSetValue } from '../models/musicbrainz'

export default function GroupableResults({props, i}) {
  const currentReleaseGroup = useRecoilValue(currentReleaseGroupAtom)
  const resetThenSet = useSetRecoilState(resetThenSetValue)

  function handleClick(id, title) {
    return () => {
      resetThenSet({atom: currentReleaseGroupAtom, id: id, title: title})
    }
  }

  function handleKeyPress(e) {
    if (['Enter', 'Space'].includes(e.code)) {
      e.currentTarget.parentElement.click();
    }
  }

  const GroupedItems = ({items, i}) =>
  <div key={`${items[0].id}`} role="group" aria-labelledby={`group_${i}`}>
    <ResultSectionHeader type1={items[0].type1} type2={items[0].type2} i={i} />
    <ItemList items={items} />
  </div>

  const ItemList = ({items}) =>
  items.map((item,i) => <SingleItem item={item} i={i} key={item.id ?? i}/>)

  const SingleItem = ({item, i}) => {
    const classNames = () => {
      let cn = []
      cn.push(i % 2 ? styles.resultItemAlt : styles.resultItem)
      cn.push(item.id == currentReleaseGroup.id ? styles.resultItemHl : '')
      return cn.join(' ').trim()
    }
    return (
      <Fragment key={`${item.id}`}>
      <div role="listitem" className={classNames()}
        aria-current={item.id == currentReleaseGroup.id ? true : null}
        onClick={handleClick(item.id, item.title)} >
        <span role="link" className={styles.releaseTitle}
          onKeyPress={handleKeyPress}
          tabIndex="0" >
          {item.title}
        </span>
        <span className={styles.releaseDate}>
          {extractYear(item.firstReleaseDate) ?? ''}
        </span>
      </div>
      </Fragment>
    )
  }

  return (
    (props.length && (props instanceof Array)
    ?
      <GroupedItems items={props} i={i} />
    :
      <SingleItem item={props} i={i} />
    )
  )
}
