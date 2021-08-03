import fetchData from './fetcher'

export async function coverArtLookup(id) {
  const resultMapper = (json) => {
    let preferredImage = json.images?.find(_ => _.front == true)
    preferredImage = preferredImage ?? json.images?.[0]
    if (preferredImage) {
      return ({
        id: id,
        imgUrlSmall: preferredImage.thumbnails?.small?.replace(/^http[^s]:/, 'https:'),
        imgUrlLarge: preferredImage.image.replace(/^http[^s]:/, 'https:')
      })
    }
  }

  const results = await fetchData(
    `https://coverartarchive.org/release/${id}`,
    [],
    resultMapper
  )
  return results
}
