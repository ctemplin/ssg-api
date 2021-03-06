import { useSetRecoilState, useRecoilValue } from 'recoil'
import { currentArtistAtom, breadcrumbsSel } from '../models/musicbrainz'

export default function RecordingArtistList({credits}) {

  const currentArtist = useRecoilValue(currentArtistAtom)
  const jumpToArtistAndSaveRevertValues = useSetRecoilState(breadcrumbsSel)

  const handleClick = (id, name) => () => {
    jumpToArtistAndSaveRevertValues({artistId: id, artistName: name})
  }

  return (
    <>
    {credits?.map(_ =>
      <span key={_.id}>
      <>
      {_.id != currentArtist.id ?
        <a onClick={handleClick(_.id, _.name)}>{_.name}</a>
      :
        <span>{_.name}</span>
      }
      <span>{_.joinphrase}</span>
      </>
      </span>
    )}
    </>
  )
}