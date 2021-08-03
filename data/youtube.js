import fetchData from './fetcher'

export async function youtubeVideoSearch(params) {
  const resultMapper = (json) => json

  const results = await fetchData(
    '/.netlify/functions/youtube-video-search',
    params,
    resultMapper
  )
  return results
}
