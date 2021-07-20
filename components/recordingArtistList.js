import { ArtistContext } from './artistContext'
import { useContext } from 'react'
import styles from '../styles/RecordingArtistList.module.scss'

export default function RecordingArtistList({data}) {

	const handleClick = (id, name, func) => {
		return (e) => {
			e.preventDefault()
			func(id,name)
		}
	}

	const artistContext = useContext(ArtistContext)

	return (
		<>
		{data.map(_ =>
			<>
			<span key={_.artist.id}>
				{_.artist.id && _.artist.id != artistContext.id ? <a className={styles.link} onClick={handleClick(_.artist.id, _.name, artistContext.handleClick)}>{`${_.name}`}</a> : ` ${_.name}`}
			</span>
			<span>{`${_.joinphrase}`}</span>
			</>
			)}
		</>
	)
}