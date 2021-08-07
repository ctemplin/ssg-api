import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getRouterArgs } from '../lib/routes'
import { useRecoilState, useRecoilValue, useRecoilTransaction_UNSTABLE } from 'recoil'
import { currentReleaseCoverArtAtom } from '../models/coverartartchive'
import {
  newDefaultsWithProps,
  currentArtistAtom, currentArtistSlug,
  currentRecordingAtom, currentRecordingSlug,
  currentReleaseAtom, currentReleaseGroupAtom,
  currentReleaseGroupSlug, currentReleaseSlug
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

    // Rehydrate from refresh, pasted url, bookmark, etc
  const initResourcesFromQueryString = useRecoilTransaction_UNSTABLE(
    qsIds ?
      ({get, set}) => (qsIds) => {
        let ret = {} // track which ids have been set
        let _aid = get(currentArtistAtom).id
        if (!_aid && qsIds.aid) {
          set(currentArtistAtom, newDefaultsWithProps(currentArtist,
            {id: qsIds.aid}))
          ret.aid = qsIds.aid
          let _rgid = get(currentReleaseGroupAtom).id
          if (!_rgid && qsIds.rgid) {
            set(currentReleaseGroupAtom, newDefaultsWithProps(currentReleaseGroup,
              {id: qsIds.rgid}))
            ret.rgid = qsIds.rgid
            let _rid = get(currentReleaseAtom).id
            if (!_rid && qsIds.rid) {
              set(currentReleaseAtom, newDefaultsWithProps(currentRelease,
                {id: qsIds.rid}))
              ret.rid = qsIds.rid
              // let _tid = get(currentRecordingAtom).id
              // if (!_tid && qsIds.tid) {
              //   set(currentRecordingAtom, newDefaultsWithProps(currentRecording, 
              //     {id: qsIds.tid}))
              // }
            }
          }
        }
        return ret
      }
    :
    ({get}) => {}
    , []
  )

  useEffect(() => {
    initResourcesFromQueryString(qsIds)
  }, [])

  /**
   * Sync the browser address bar (path and querystring) to reflect the
   * state of the current resources (artist, release group, release, recording).
   */
  useEffect(() => {
    const resources = [
      [currentArtist.id, 'aid', artistSlug],
      [currentReleaseGroup.id, 'rgid', releaseGroupSlug],
      [currentRelease.id, 'rid', releaseSlug],
      [currentRecording.id, 'tid', recordingSlug]
    ]
    let slugs = []
    const queryParams = {}
    // look thru resources in order (artist -> recording) for a discrepancy
    let wasChangeFound = !resources.every((resource, i, arr) => {
      if (resource[0] && resource[0] != router.query[resource[1]]) {
        // get all the slugs for resources up to and including this one
        arr.slice(0, i+1).forEach(s => {
          slugs.push(s[2])
          queryParams[s[1]] = s[0]
        })
        // break loop. additional path segments and params will be truncated
        return false;
      }
      return true; //continue loop
    })
    if (wasChangeFound) {
      let routerArgs = getRouterArgs(
        router, slugs, queryParams
      )
      // Replace url (no history update)
      // router.replace.apply(this, routerArgs)
    }
  },
  [ router,
    currentArtist.id, currentReleaseGroup.id, currentRelease.id, currentRecording.id,
    artistSlug, releaseGroupSlug, releaseSlug, recordingSlug ]
  )
  return null
}