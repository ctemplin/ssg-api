import * as fetch from 'node-fetch'
import HeadTag from '../../components/head'
import Image from 'next/image'
import styles from '../../styles/AppHistory.module.sass'
import { useEffect, useRef } from 'react'

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

  const st = useRef(0)
  useEffect(() => {
    const onBgScroll = (e) => {
      e.preventDefault() // allow bubble
    }

    const onScroll = (e,) => {
      if (e.eventPhase !== 2) return

      var dir = e.srcElement.scrollTop < st.current ? 'up' : 'down'
      var codeBlocks = document.querySelectorAll('.' + styles.codeBg)
      codeBlocks.forEach((el) => el.scrollBy(0, dir === 'up' ? -5 : 5))

      if (e.srcElement.scrollTop > st.current) {
        var toolBlocks = document.querySelectorAll('.' + styles.toolBlock)
        // console.log(toolBlocks.length)
        toolBlocks.forEach((el) => {
          var n = el.offsetTop - document.body.scrollTop
          if (n < 550) {
            el.classList.add(styles.toolBlockFocus)
          }
        })
      }
      
      st.current = e.srcElement.scrollTop
    }
    document.body.addEventListener('scroll', onScroll)
    document.querySelectorAll('.' + styles.codeBg).forEach(
      (el) => el.addEventListener('scroll', onBgScroll)
    )
    return () => {
      document.body.removeEventListener('scroll', onScroll)
      document.querySelectorAll('.' + styles.codeBg).forEach(
        (el) => el.removeEventListener('scroll', onBgScroll)
      )
    }
  }, [])

  const pre =
`useEffect(() => {
  setCoverArt({id: dispData.id})
  resetRecording()
},[dispData.id, setCoverArt, resetRecording])`

  return (
    <>
    <HeadTag title={title} />
    <div className={styles.container}>
      <div className={styles.column}>

        <h1>Header</h1>
        <p>Consectetur laboris non velit cupidatat consequat sit aliquip do aliqua laboris. Sunt quis veniam exercitation quis deserunt commodo fugiat nisi laborum. Consequat officia eiusmod aliqua eu. Aute duis esse ipsum nulla enim ad enim. Esse eiusmod minim cillum nisi quis cillum incididunt nisi eu ipsum anim laborum laboris. Cillum exercitation pariatur nisi cillum nostrud irure officia exercitation. Non sit voluptate ad exercitation.</p>

        <p>Quis aliqua culpa consequat irure consequat. Ut ea aliqua anim adipisicing. Mollit labore reprehenderit eu do.</p>
        <h2 className={styles.category}>Packages</h2>
        <div className={styles.toolBlock} id="nextjsBlock">
          <div className={styles.toolLogo}>
            <Image
                src="/nextjs_logo.png" className={styles.logo}
                layout="fixed" alt="NextJs Logo"
                width="360" height="190"
              />
          </div>
          <div className={styles.text}>NextJS is React for "static" sites. This allows for on-demand, CDN-based deployments. Most of the dynamic data used in this app is requested directly by the browser (<a href="#APIs">see APIs</a> for MusicBraninz). Other API calls (Youtube, etc.) require private credentials. Such API calls are hosted as on-demand server functions.


          </div>
        </div>
        <div className={styles.codeBg}>
          <pre>{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}</pre>
        </div>
        <div className={`${styles.toolBlock} ${styles.toolBlockAlt}`}>
          <div className={styles.toolLogo}>
            <Image
                src="/recoiljs_logo.png" className={styles.logo}
                layout="fixed" alt="RecoilJs Logo"
                width="375" height="125"
              />
          </div>
          <div className={styles.text}><h3>Recoil</h3> </div>
        </div>
        <h2 className={styles.category} id="APIs">APIs</h2>
        <div className={styles.toolBlock}>
          <div className={styles.toolLogo}>
            <Image
                src="/musicbrainz_logo.png" className={styles.logo}
                layout="fixed" alt="Musicbrainz Logo"
                width="360" height="106"
              />
          </div>
          <div className={styles.text}><h3>MusicBrainz API</h3></div>
        </div>
        <div className={`${styles.toolBlock} ${styles.toolBlockAlt}`}>
          <div className={styles.toolLogo}>
            <Image
                src="/netlify_logo.png" className={styles.logo}
                layout="fixed" alt="Netlify Logo"
                width="368" height="100"
              />
          </div>
          <div className={`${styles.text} ${styles.faText}`}><h3>Netlify API</h3></div>
        </div>
        <h2 className={styles.category}>Design</h2>
        <div className={styles.toolBlock}>
          <div className={styles.toolLogo}>
            <Image
                src="/fontawesome_logo.png" className={styles.logo}
                layout="fixed" alt="FontAwesome Logo"
                width="400" height="80"
              />
          </div>
          <div className={`${styles.text} ${styles.faText}`}><h3>FontAwesome</h3></div>
        </div>

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