import React, { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentArtistAtom, currentArtistPanelFormatSorted } from '../../models/musicbrainz'
import artistData from '../data/artist_mock.json'

const withStateMgmt = (InnerComponent) => {
  const OuterComponent = () => {
  const setCurrentArtist = useSetRecoilState(currentArtistAtom)
  const dispData = useRecoilValue(currentArtistPanelFormatSorted())
  
  useEffect(() => {
    setCurrentArtist(artistData)
  }, [])

  return dispData.releaseGroups.map((_,i) =>
    <InnerComponent props={_}  i={i} key={_.id ?? i} /> )
}
  OuterComponent.displayName = `WithStateMgmt(${InnerComponent.name})`
  return OuterComponent
} 

export default withStateMgmt
