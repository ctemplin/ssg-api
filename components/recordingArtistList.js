import { useRecoilState } from 'recoil'
import { currentArtistAtom } from '../pages/_app'
import styles from '../styles/RecordingArtistList.module.scss'

export default function RecordingArtistList({data}) {

	const [currentArtist, setCurrentArtist] = useRecoilState(currentArtistAtom)

	return (
		<>
		{data.map(_ =>
			<>
			<span key={_.artist.id}>
				{_.artist.id && _.artist.id != currentArtist.id ? <a className={styles.link} onClick={() => setCurrentArtist({id: _.artist.id})}>{`${_.name}`}</a> : ` ${_.name}`}
			</span>
			<span>{`${_.joinphrase}`}</span>
			</>
			)}
		</>
	)
}