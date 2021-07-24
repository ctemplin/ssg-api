import { useRecoilState, useSetRecoilState } from 'recoil'
import { currentArtistAtom, previousUrlAtom } from '../pages/_app'
import { useRouter } from 'next/router'
import styles from '../styles/RecordingArtistList.module.scss'

export default function RecordingArtistList({data}) {

  const [currentArtist, setCurrentArtist] = useRecoilState(currentArtistAtom)
  const setPreviousUrl = useSetRecoilState(previousUrlAtom)
  const router = useRouter()

  const handleArtistClick = (newArtistId, newArtistName) => {
    return () => {
      setPreviousUrl({
        url: router.asPath,
        strings: [currentArtist.name]
      })
      setCurrentArtist({id: newArtistId, name: newArtistName})
    }
  }

  return (
    <>
    {data.map(_ =>
      <>
      <span key={_.artist.id}>
        {_.artist.id && _.artist.id != currentArtist.id ?
          <a className={styles.link}
            onClick={handleArtistClick(_.artist.id, _.artist.name)}
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