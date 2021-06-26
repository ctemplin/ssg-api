import React,{useEffect, useState} from 'react'

export default function CoverArt({id}) {

  const [apiData, setApiData] = useState({})

  async function getData() {
    const resp = await fetch(
      'http://coverartarchive.org/release/' + id,
      {
        headers: {"Accept": "application/json"}
      }
    )
    const json = await resp.json()
    setApiData({imgUrl: json.images?.[0]?.image})
  }

  useEffect(() =>  {
    getData()
  },[])

  return(
    <img src={apiData.imgUrl} />
  )
}