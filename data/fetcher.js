export default async function fetchData(url, params, mapFunc) {
  const _params = new URLSearchParams()
  params.forEach(param => _params.append(...param))
  var _url
  try {
    // absolute url
    _url = new URL(url)
    _url.search = _params.toString()
  } catch (error) {
    // relative url for function calls
    _url = `${url}?${_params.toString()}`
  }
  const resp = await fetch(_url, {headers: {"Accept": "application/json"}})
  if (resp.status >= 200 && resp.status <= 299) {
    const json = await resp.json()
    return mapFunc(json)
  } else {
    throw new Error(`Error: ${resp.status} ${resp.statusText} on ${_url}`)
  }
}
