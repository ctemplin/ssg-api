import { useSetRecoilState, useRecoilValue } from 'recoil'
import { currentArtistAtom, breadcrumbsSel } from '../pages/_app'
import styles from '../styles/RecordingArtistList.module.scss'

export default function RecordingArtistList({data}) {

  const currentArtist = useRecoilValue(currentArtistAtom)
  const jumpToArtistAndSaveRevertValues = useSetRecoilState(breadcrumbsSel)

  const handleArtistClick = (id, name) => () => {
    jumpToArtistAndSaveRevertValues({artistId: id, artistName: name})
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