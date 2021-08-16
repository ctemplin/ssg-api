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

  switch (InnerComponent.name) {
    case 'Artist':
      return <InnerComponent
        dispData={dispData}
        errored={false} errorMsg={null}
        isLoading={false}
        params={{column: 'default', dir: 'asc'}}
        setParams={null}
      />
    case 'GroupableResults':
      return dispData.releaseGroups.map((_,i) =>
        <InnerComponent props={_}  i={i} key={_.id ?? i} /> )
    default:
      break;
  }
}
  OuterComponent.displayName = `WithStateMgmt(${InnerComponent.name})`
  return OuterComponent
}

export default withStateMgmt
