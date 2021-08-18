import React from 'react'
import * as fetch from 'node-fetch'

export async function getStaticProps(context) {
  const url = new URL(
    `https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/deploys`
  )
  url.searchParams.append('page', '1')
  url.searchParams.append('per_page', '40')
  const resp = await fetch(url,
    {
      headers: {
        'User-Agent': 'mb.christemplin.com (ctemplin@gmail.com)',
        'Authorization': `Bearer ${process.env.NETLIFY_OAUTH_TOKEN}`,
        'Accept': 'application/json'
      }
    }
  )
  if (resp.status >= 200 && resp.status <= 299) {
    const json = await resp.json()
    let deploys = json.filter(_ => ["ready", "building"].includes(_.state))
    let _ = {}
    deploys = deploys.map(deploy => (
      { id: _.id,
        created_at: _.created_at, 
        state: _.state, 
        title: _.title, 
        branch: _.branch } = deploy )
        )
    return {
      props: {deploys}
    }
  } else {
    throw new Error(`Error: ${resp.status} ${resp.statusText} on ${url}`)
  }
}

export default function AppHistory({deploys}) {
  return (
    <>
    {deploys.map(_=>
      <div key={_.id}>{_.created_at} {_.title} {_.branch}</div>
    )}
    </>
  )
}