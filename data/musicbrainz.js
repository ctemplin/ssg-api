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
    throw new Error(`Error: ${resp.status} ${resp.statusText}`)
  }
}

export async function artistSearch(terms) {
  const resultMapper = (json) => {
    return ({ matches:
        json.artists.map(artist => {
          return {id: artist.id, name: artist.name}
        })
      }
    )
  }

  const results = await fetchData(
    'https://musicbrainz.org/ws/2/artist',
    [
      ["query", terms],
      ["limit", 20]
      ["offset", 0]
    ],
    resultMapper
  )
  return results
}