import { cleanup } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentArtistAtom, currentArtistPanelFormatSorted,
         releaseGroupLookup, currentReleaseGroupAtom, currentReleaseGroupPanelFormat,
         releaseLookup, currentReleaseAtom, currentReleasePanelFormat,
         resetThenSetValue } from '../../models/musicbrainz'
import withMbz from '../../components/mbzComponent'
import artistData from '../data/artist_mock.json'

const withStateMgmt = (InnerComponent) => {
  const OuterComponent = ({id}) => {
  const setCurrentArtist = useSetRecoilState(currentArtistAtom)
  const [params, setParams] = useState({column: 'default', dir: 'asc'})
  const dispData = useRecoilValue(currentArtistPanelFormatSorted(params))
  const ReleaseGroup_MBZ = withMbz(InnerComponent)
  const Release_MBZ = withMbz(InnerComponent)
  const resetThenSet = useSetRecoilState(resetThenSetValue)

  useEffect(() => {
    // Loading (formatted) JSON direct from mock
    setCurrentArtist(artistData)

    // Loading (API) JSON thru data layer with msw
    if (InnerComponent.name == "Release") {
      resetThenSet({atom: currentReleaseAtom, id: id})
    }
    if (InnerComponent.name == "ReleaseGroup") {
      resetThenSet({atom: currentReleaseGroupAtom, id: id})
    }
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
    case 'ReleaseGroup':
      return <ReleaseGroup_MBZ
          lookup={releaseGroupLookup}
          atom={currentReleaseGroupAtom}
          dispSel={currentReleaseGroupPanelFormat}
        ><InnerComponent /></ReleaseGroup_MBZ>
    case 'Release':
      return <Release_MBZ
        lookup={releaseLookup}
        atom={currentReleaseAtom}
        dispSel={currentReleasePanelFormat}
      ><InnerComponent/></Release_MBZ>
  }
}
  OuterComponent.displayName = `WithStateMgmt(${InnerComponent.name})`
  return OuterComponent
}

export default withStateMgmt
