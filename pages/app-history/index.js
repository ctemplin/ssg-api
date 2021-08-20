import * as fetch from 'node-fetch'
import HeadTag from '../../components/head'
import Image from 'next/image'
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
    <div className={styles.container}>
      <div className={styles.column}>
        <ul>
        <li>Packages: Nextjs, Recoiljs, Fontawesome, Sass</li>
        <li>APIs: Musicbrainz, CoverArtArchive, Youtube, Netlify-API</li>
        <li>Hosting: Netlify, Railway</li>
        </ul>

        <h2 className={styles.category}>Packages</h2>
        <div className={styles.toolBlock} id="nextjsBlock">
          <div className={styles.toolLogo}>
            <Image
                src="/nextjs_logo.png" className={styles.logo}
                layout="intrinsic" alt="NextJs Logo"
                width="360" height="190"
              />
          </div>
          <div className={styles.text}><h3>NextJS</h3> - Consectetur ea pariatur 
          qui tempor et exercitation reprehenderit aute anim fugiat deserunt. 
          Tempor laboris magna sunt sunt id excepteur labore. Commodo Lorem mollit 
          in irure velit nulla ex.</div>
        </div>
        <div className={`${styles.toolBlock} ${styles.toolBlockAlt}`}>
          <div className={styles.toolLogo}>
            <Image
                src="/recoiljs_logo.png" className={styles.logo}
                layout="intrinsic" alt="RecoilJs Logo"
                width="375" height="125"
              />
          </div>
          <div className={styles.text}><h3>Recoil</h3> -</div>
        </div>
        <h2 className={styles.category}>APIs</h2>
        <div className={styles.toolBlock}>
          <div className={styles.toolLogo}>
            <Image
                src="/musicbrainz_logo.png" className={styles.logo}
                layout="intrinsic" alt="Musicbrainz Logo"
                width="360" height="106"
              />
          </div>
          <div className={styles.text}><h3>MusicBrainz API</h3></div>
        </div>
        <div className={`${styles.toolBlock} ${styles.toolBlockAlt}`}>
          <div className={styles.toolLogo}>
            <Image
                src="/netlify_logo.png" className={styles.logo}
                layout="intrinsic" alt="Netlify Logo"
                width="368" height="100"
              />
          </div>
          <div className={`${styles.text} ${styles.faText}`}><h3>Netlify API</h3></div>
        </div>
        {/* <h2 className={styles.category}>Design</h2>
        <div className={styles.toolBlock}>
          <div className={`${styles.text} ${styles.faText}`}><h3>Text about FontAwesome</h3></div>
          <div className={styles.toolLogo}>
            <Image
                src="/musicbrainz_logo.png" className={styles.logo}
                layout="intrinsic" alt="Musicbrainz Logo"
                width="240" height="240"
              />
          </div>
        </div> */}

        {deploys.map(_=>
          <div className={styles.deployRow} key={_.id}>
            <span>{_.createdAt}</span>
            <span>{_.title}</span>
            <span>{_.branch}</span>
          </div>
        )}
      </div>
    </div>
    </>
  )
}