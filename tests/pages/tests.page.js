import { useEffect } from 'react'
import ResultSectionHeader from '../../components/resultSectionHeader'
import FilterConfig from '../../components/filterConfig'
import { currentReleaseGroupAtom, userCountriesAtom } from '../../models/musicbrainz'
import { useSetRecoilState } from 'recoil'

export default function Home() {

  const setCountries = useSetRecoilState(userCountriesAtom)
  const setReleaseGroups = useSetRecoilState(currentReleaseGroupAtom)

  return null
}