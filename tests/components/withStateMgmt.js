import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { artistLookup, currentArtistAtom, currentArtistPanelFormatSorted,
         releaseGroupLookup, currentReleaseGroupAtom, currentReleaseGroupPanelFormat,
         releaseLookup, currentReleaseAtom, currentReleasePanelFormat,
         resetThenSetValue } from '../../models/musicbrainz'
import withMbz from '../../components/mbzComponent'

class MbzProps {
  constructor(lookup, atom, dispSel, dispParams) {
    Object.assign(this, { lookup, atom, dispSel, dispParams })
  }
}

const mbzPropVals = {
  Artist: new MbzProps(
    artistLookup, currentArtistAtom, currentArtistPanelFormatSorted,
    {column: 'default', dir: 'asc'}),
  ReleaseGroup: new MbzProps(
    releaseGroupLookup, currentReleaseGroupAtom, currentReleaseGroupPanelFormat),
  Release: new MbzProps(
    releaseLookup, currentReleaseAtom, currentReleasePanelFormat)
}

const withStateMgmt = (InnerComponent) => {
  const OuterComponent = ({id, dispParams}) => {
    const Component_MBZ = withMbz(InnerComponent)
    const resetThenSet = useSetRecoilState(resetThenSetValue)
    const propVals = mbzPropVals[InnerComponent.name]

    useEffect(() => {
      resetThenSet({atom: propVals.atom, id: id})
    }, [])

    return <Component_MBZ
      lookup={propVals.lookup}
      atom={propVals.atom}
      dispSel={propVals.dispSel}
      dispParams={propVals.dispParams}
    ><InnerComponent/></Component_MBZ>
  }
  OuterComponent.displayName = `WithStateMgmt(${InnerComponent.name})`
  return OuterComponent
}

export default withStateMgmt
