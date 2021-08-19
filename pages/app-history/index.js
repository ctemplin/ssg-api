import * as fetch from 'node-fetch'
import HeadTag from '../../components/head'
import styles from '../../styles/AppHistory.module.sass'

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
    deploys = deploys.map(_ => (
      { id:         _.id,
        createdAt:  new Date(_.created_at).toLocaleString('us-EN'),
        state:      _.state,
        title:      _.title,
        branch:     _.branch }
    ))
    return {
      props: {title: 'About', deploys: deploys},
      revalidate: false
    }
  } else {
    throw new Error(`Error: ${resp.status} ${resp.statusText} on ${url}`)
  }
}

export default function AppHistory({title, deploys}) {
  return (
    <>
    <HeadTag title={title} />
    {deploys.map(_=>
      <div className={styles.deployRow} key={_.id}>
        <span>{_.createdAt}</span>
        <span>{_.title}</span>
        <span>{_.branch}</span>
      </div>
    )}
    </>
  )
}