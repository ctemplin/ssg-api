import { useEffect } from 'react'
import ResultSectionHeader from '../../components/resultSectionHeader'
import FilterConfig from '../../components/filterConfig'
import { currentReleaseGroupAtom, userCountriesAtom } from '../../models/musicbrainz'
import { useSetRecoilState } from 'recoil'
import releaseGroupData from '../data/releaseGroup_mock.json'

export default function Home() {

  const setCountries = useSetRecoilState(userCountriesAtom)
  const setReleaseGroups = useSetRecoilState(currentReleaseGroupAtom)

  useEffect(() => {
    setCountries(new Set(['US', 'DE', '??']))
    setReleaseGroups(releaseGroupData)
  }, [])

  return (
    <>
    <ResultSectionHeader type1={'primary'} type2={'secondary'} />
    <ResultSectionHeader type1={'primary'} type2={''} />
    <ResultSectionHeader type1={''} type2={'secondary'} />

    <FilterConfig
      handleChange={null}
      persistChange={null}
      handleClose={null}
      anyCountryMatch={null} />
    </>
  )
}