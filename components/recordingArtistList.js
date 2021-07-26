import { useRecoilState, useSetRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { currentArtistAtom, currentReleaseGroupAtom, currentReleaseAtom, breadcrumbsSel, prevBreadcrumbsAtom, prevItems } from '../pages/_app'
import { useRouter } from 'next/router'
import styles from '../styles/RecordingArtistList.module.scss'

export default function RecordingArtistList({data}) {

  const [currentArtist, setCurrentArtist] = useRecoilState(currentArtistAtom)
  const currentBreadcrumbs = useRecoilValue(breadcrumbsSel)
  const setPreviousBreadcrumbs = useSetRecoilState(prevBreadcrumbsAtom)
  const setPrevItems = useSetRecoilState(prevItems)
  const artist = useRecoilValue(currentArtistAtom)
  const releaseGroup = useRecoilValue(currentReleaseGroupAtom)
  const resetReleaseGroup = useResetRecoilState(currentReleaseGroupAtom)
  const release = useRecoilValue(currentReleaseAtom)
  const resetRelease = useResetRecoilState(currentReleaseAtom)
  const router = useRouter()

  const handleArtistClick = (id) => {
    return () => {
      setPreviousBreadcrumbs(currentBreadcrumbs)
      setPrevItems({
        artist: artist,
        releaseGroup: releaseGroup,
        release: release
      })
      resetRelease()
      resetReleaseGroup()
      setCurrentArtist({id: id})
    }
  }

  return (
    <>
    {data.map(_ =>
      <>
      <span key={_.artist.id}>
        {_.artist.id && _.artist.id != currentArtist.id ?
          <a className={styles.link}
            onClick={handleArtistClick(_.artist.id)}
          >
              {`${_.name}`}
          </a> : ` ${_.name}`}
      </span>
      <span>{`${_.joinphrase}`}</span>
      </>
      )}
    </>
  )
}