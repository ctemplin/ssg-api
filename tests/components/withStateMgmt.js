import { cleanup } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentArtistAtom, currentArtistPanelFormatSorted,
         releaseLookup, currentReleasePanelFormat
} from '../../models/musicbrainz'
import withMbz from '../../components/mbzComponent'
import artistData from '../data/artist_mock.json'
import { currentReleaseAtom, resetThenSetValue } from '../../models/musicbrainz'

const withStateMgmt = (InnerComponent) => {
  const OuterComponent = ({id}) => {
  const setCurrentArtist = useSetRecoilState(currentArtistAtom)
  const [params, setParams] = useState({column: 'default', dir: 'asc'})
  const dispData = useRecoilValue(currentArtistPanelFormatSorted(params))
  const Release_MBZ = withMbz(InnerComponent)
  const resetThenSet = useSetRecoilState(resetThenSetValue)

  useEffect(() => {
    // Loading (formatted) JSON direct from mock
    setCurrentArtist(artistData)

    // Loading (API) JSON thru data layer with msw
    if (InnerComponent.name == "Release") {
      resetThenSet({atom: currentReleaseAtom, id: id})
    }

    return () =>  {
      cleanup()
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
    case 'Release':
      return <Release_MBZ
        lookup={releaseLookup}
        atom={currentReleaseAtom}
        dispSel={currentReleasePanelFormat}
      ><InnerComponent/></Release_MBZ>

    default:
      break;
  }
}
  OuterComponent.displayName = `WithStateMgmt(${InnerComponent.name})`
  return OuterComponent
}

export default withStateMgmt
