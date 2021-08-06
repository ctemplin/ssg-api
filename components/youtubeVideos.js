import RecordingThumb from './recordingThumb'
import NetworkError from './networkError'
import styles from '../styles/YoutubeVideos.module.scss'

export default function YoutubeVideos({dispData, isLoading, errored, errorMsg}) {

  return (
    <>
    <p>YouTube:</p>
    {isLoading || errored &&
      <>
        {isLoading && <p>loading</p>}
        {errored &&
        <NetworkError
          errorMsg={errorMsg}
          style={{'flexDirection': 'row'}}
        />
        }
      </>
    }
    {!isLoading && !errored &&
      <div className={styles.resultItemList}>
      {dispData.items.map((_) => {
        return (
          <RecordingThumb key={_.id.videoId} videoId={_.id.videoId}
            title={_.snippet.title}
            imgSrc={_.snippet.thumbnails?.default.url}
            imgWidth={_.snippet.thumbnails?.default.width}
            imgHeight={_.snippet.thumbnails?.default.height}
          />
        )
      })}
      </div>
    }
    </>
  )
}