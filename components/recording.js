import {useState, useEffect} from 'react'

export default function Recording({id, releaseId}) {

  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return 
    const getData = async () => {
      const url = new URL(`https://musicbrainz.org/ws/2/recording/${id}`)
      url.searchParams.append("inc", "artist-credits")
      const resp = await fetch(
        url,
        {headers: {"Accept": "application/json"}}
      )
      const json = await resp.json()
      setData(json)
      setIsLoading(false)
    }
    const callTest = async () => {
      const turl = new URL('/.netlify/functions/test')
      turl.searchParams.append()

    }
    getData()
  },[id])

  return (
    <div>
    {isLoading ?
      <p>loading</p>
      :
    <div>
    {data.title}
    {data["artist-credit"].map(_ => 
      <>
      <span>{_.joinphase}</span><span>{_.name}</span><br/>
      </>
    )}
    </div>
    }
    </div>
  )
}