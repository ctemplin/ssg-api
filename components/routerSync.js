import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import {
  currentArtistAtom, currentReleaseAtom, currentReleaseGroupAtom,
  resetThenSetValue
} from '../models/musicbrainz'

export default function RouterSync({qsIds}) {
  const resetThenSet = useSetRecoilState(resetThenSetValue)

  // Rehydrate from query string of pasted url, bookmark, etc
  useEffect(() => {
    let _aid = currentArtistAtom.id
    if (!_aid && qsIds.aid) {
      resetThenSet({atom: currentArtistAtom, id: qsIds.aid})
      let _rgid = currentReleaseGroupAtom.id
      if (!_rgid && qsIds.rgid) {
        resetThenSet({atom: currentReleaseGroupAtom, id: qsIds.rgid})
        let _rid = currentReleaseAtom.id
        if (!_rid && qsIds.rid) {
          resetThenSet({atom: currentReleaseAtom, id: qsIds.rid})
          // let _tid = currentRecordingAtom.id
          // if (!_tid && qsIds.tid) {
          //   resetThenSet({atom: currentRecordingAtom, id: qsIds.tid})
          // }
        }
      }
    }
  }, [qsIds, resetThenSet])

  return null
}