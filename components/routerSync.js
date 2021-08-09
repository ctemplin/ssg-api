import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getRouterArgs } from '../lib/routes'
import { useRecoilState, useRecoilValue,
         useSetRecoilState } from 'recoil'
import { currentReleaseCoverArtAtom } from '../models/coverartartchive'
import {
  currentArtistAtom, currentArtistSlug,
  currentRecordingAtom, currentRecordingSlug,
  currentReleaseAtom, currentReleaseGroupAtom,
  currentReleaseGroupSlug, currentReleaseSlug,
  resetThenSetValue
} from '../models/musicbrainz'


export default function RouterSync({qsIds}) {
  const router = useRouter()

  const currentArtist = useRecoilValue(currentArtistAtom)
  const artistSlug = useRecoilValue(currentArtistSlug)
  const currentReleaseGroup = useRecoilValue(currentReleaseGroupAtom)
  const releaseGroupSlug = useRecoilValue(currentReleaseGroupSlug)
  const currentRelease = useRecoilValue(currentReleaseAtom)
  const releaseSlug = useRecoilValue(currentReleaseSlug)
  const coverArt = useRecoilValue(currentReleaseCoverArtAtom)
  const currentRecording = useRecoilValue(currentRecordingAtom)
  const recordingSlug = useRecoilValue(currentRecordingSlug)
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
  }, [qsIds])

  /**
   * Sync the browser address bar (path and querystring) to reflect the
   * state of the current resources (artist, release group, release, recording).
   */
  // useEffect(() => {
  //   const resources = [
  //     [currentArtist.id, 'aid', artistSlug],
  //     [currentReleaseGroup.id, 'rgid', releaseGroupSlug],
  //     [currentRelease.id, 'rid', releaseSlug],
  //     [currentRecording.id, 'tid', recordingSlug]
  //   ]
  //   let slugs = []
  //   const queryParams = {}
  //   // look thru resources in order (artist -> recording) for a discrepancy
  //   let wasChangeFound = !resources.every((resource, i, arr) => {
  //     if (resource[0] && resource[0] != router.query[resource[1]]) {
  //       // get all the slugs for resources up to and including this one
  //       arr.slice(0, i+1).forEach(s => {
  //         slugs.push(s[2])
  //         queryParams[s[1]] = s[0]
  //       })
  //       // break loop. additional path segments and params will be truncated
  //       return false;
  //     }
  //     return true; //continue loop
  //   })
  //   if (wasChangeFound) {
  //     let routerArgs = getRouterArgs(
  //       router, slugs, queryParams
  //     )
  //     // Replace url (no history update)
  //     router.replace.apply(this, routerArgs)
  //   }
  // },
  // [ router,
  //   currentArtist.id, currentReleaseGroup.id, currentRelease.id, currentRecording.id,
  //   artistSlug, releaseGroupSlug, releaseSlug, recordingSlug ]
  // )
  return null
}