async function fetchData(url, params, mapFunc) {
  var _url = new URL(url)
  const _params = new URLSearchParams()
  params.forEach(param => {
    let [name, value] = param
    _params.append(name, value)
  });
  _url.search = _params.toString()
  const resp = await fetch(_url, {headers: {"Accept": "application/json"}})
  if (resp.status >= 200 && resp.status <= 299) {
    const json = await resp.json()
    return mapFunc(json)
  } else {
    throw new Error(`Error: ${resp.status} ${resp.statusText} on ${_url}`)
  }
}

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
