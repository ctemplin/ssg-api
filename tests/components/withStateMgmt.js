import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { artistLookup, currentArtistAtom, currentArtistPanelFormatSorted,
         releaseGroupLookup, currentReleaseGroupAtom, currentReleaseGroupPanelFormat,
         releaseLookup, currentReleaseAtom, currentReleasePanelFormat,
         resetThenSetValue } from '../../models/musicbrainz'
import withMbz from '../../components/mbzComponent'

const withStateMgmt = (InnerComponent) => {
  const OuterComponent = ({id}) => {
    const Artist_MBZ = withMbz(InnerComponent)
    const ReleaseGroup_MBZ = withMbz(InnerComponent)
    const Release_MBZ = withMbz(InnerComponent)
    const resetThenSet = useSetRecoilState(resetThenSetValue)

    useEffect(() => {
      // Loading (API) JSON thru data layer with msw
      if (InnerComponent.name == "Artist") {
        resetThenSet({atom: currentArtistAtom, id: id})
      }
      if (InnerComponent.name == "Release") {
        resetThenSet({atom: currentReleaseAtom, id: id})
      }
      if (InnerComponent.name == "ReleaseGroup") {
        resetThenSet({atom: currentReleaseGroupAtom, id: id})
      }
    }, [])

    switch (InnerComponent.name) {
      case 'Artist':
        return <Artist_MBZ
          lookup={artistLookup}
          atom={currentArtistAtom}
          dispSel={currentArtistPanelFormatSorted}
          dispParams={{column: 'default', dir: 'asc'}}
        ><InnerComponent/></Artist_MBZ>
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
