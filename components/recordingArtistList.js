import { useRouter } from 'next/router'
import styles from '../styles/RecordingArtistList.module.scss'

export default function RecordingArtistList({data}) {
	const router = useRouter()
	
	const handleClick = (e) => {
		e.preventDefault()
		router.push(e.currentTarget.href, undefined, {shallow: true})
	}
	
	return (
		<>
		{data.map(_ => 
			<>
			<span>
			{_.artist.id ? <a className={styles.link} onClick={handleClick} href={`/?aid=${_.artist.id}`}>{`${_.name}`}</a> : ` ${_.name}`}
			</span>
			<span>{`${_.joinphrase}`}</span>
			</>
			)}
		</>
	)
}