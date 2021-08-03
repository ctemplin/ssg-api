export default async function fetchData(url, params, mapFunc) {
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
