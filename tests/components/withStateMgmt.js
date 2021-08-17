import React, { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentArtistAtom, currentArtistPanelFormatSorted } from '../../models/musicbrainz'
import artistData from '../data/artist_mock.json'

const withStateMgmt = (InnerComponent) => {
  const OuterComponent = () => {
  const setCurrentArtist = useSetRecoilState(currentArtistAtom)
  const [params, setParams] = useState({column: 'default', dir: 'asc'})
  const dispData = useRecoilValue(currentArtistPanelFormatSorted(params))

  useEffect(() => {
    setCurrentArtist(artistData)
  }, [])

  switch (InnerComponent.name) {
    case 'Artist':
      return <InnerComponent
        dispData={dispData}
        errored={false} errorMsg={null}
        isLoading={false}
        params={params}
        setParams={setParams}
      />
    case 'GroupableResults':
      return dispData.releaseGroups.map((_,i) =>
        <InnerComponent props={_} i={i} key={_.id ?? i} /> )
    default:
      break;
  }
}
  OuterComponent.displayName = `WithStateMgmt(${InnerComponent.name})`
  return OuterComponent
}

export default withStateMgmt
