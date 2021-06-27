import React,{useEffect, useState} from 'react'
import Image from 'next/image'

export default function CoverArt({id, width=200, height=200}) {

  const [apiData, setApiData] = useState({imgUrl: '/public/headphones.svg'})

  useEffect(() =>  {
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
    getData()
  },[id])

  return(
    <Image src={apiData.imgUrl} width={width} height={height} alt="Album Art"/>
  )
}