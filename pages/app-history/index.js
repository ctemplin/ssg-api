import * as fetch from 'node-fetch'
import HeadTag from '../../components/head'
import ToolLogo from '../../components/toolLogo'
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

      var sEl = e.srcElement.scrollingElement ?? e.srcElement
      var dir = sEl.scrollTop < st.current ? 'up' : 'down'
      var codeBlocks = document.querySelectorAll('.' + styles.codeBg)
      codeBlocks.forEach((el) => {
        if (el.offsetTop - st.current < sEl.clientHeight) {
          el.scrollBy(0, dir === 'up' ? -3 : 3)
        }
      })

      if (sEl.scrollTop > st.current) {
        var toolBlocks = document.querySelectorAll('.' + styles.toolBlock)
        toolBlocks.forEach((el) => {
          var n = el.offsetTop - sEl.scrollTop
          if (n < 550) {
            el.classList.add(styles.toolBlockFocus)
          }
        })
      }
      else if (sEl.scrollTop === 0) {
        var toolBlocks = document.querySelectorAll('.' + styles.toolBlock)
        toolBlocks.forEach((el) => {
          el.classList.remove(styles.toolBlockFocus)
        })
      }
      
      st.current = sEl.scrollTop
    }
    document.addEventListener('scroll', onScroll)
    document.body.addEventListener('scroll', onScroll)
    document.querySelectorAll('.' + styles.codeBg).forEach(
      (el) => {
        el.addEventListener('scroll', onBgScroll)
      }
    )
    return () => {
      document.removeEventListener('scroll', onScroll)
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

        <h1 className={styles.h}>Header</h1>
        <p>Consectetur laboris non velit cupidatat consequat sit aliquip do aliqua laboris. Sunt quis veniam exercitation quis deserunt commodo fugiat nisi laborum. Consequat officia eiusmod aliqua eu. Aute duis esse ipsum nulla enim ad enim. Esse eiusmod minim cillum nisi quis cillum incididunt nisi eu ipsum anim laborum laboris. Cillum exercitation pariatur nisi cillum nostrud irure officia exercitation. Non sit voluptate ad exercitation.</p>

        <p>Quis aliqua culpa consequat irure consequat. Ut ea aliqua anim adipisicing. Mollit labore reprehenderit eu do.</p>
        <h2 className={`${styles.h} ${styles.category}`}>Packages</h2>
        <div className={styles.toolBlock} id="nextjsBlock">
          <ToolLogo src="/nextjs_logo.png" alt="NextJs Logo" width={360} height={190} />
          <div className={styles.text}>NextJS is React for &ldquo;static&rdquo; sites. This allows for on-demand, CDN-based deployments. Most of the dynamic data used in this app is requested directly by the browser (<a href="#APIs">see APIs</a> for MusicBraninz). Other API calls (Youtube, etc.) require private credentials. Such API calls are hosted as on-demand server functions.


          </div>
        </div>
        <div className={styles.codeBg}>
          <pre>{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}</pre>
        </div>
        <div className={`${styles.toolBlock} ${styles.toolBlockAlt}`}>
          <ToolLogo src="/recoiljs_logo.png" alt="RecoilJs Logo" width={375} height={125} />
          <div className={styles.text}>There&apos;s no shortage of alternatives to React&apos;s solid but decentralized state management. Recoil is not only officially blessed by, creator of React, Facebook, it also has many features to recommend it. MusicBrainz Explorere benefits from Recoil&apos;s seemless handling of asynchronous data fetching and caching among other features.</div>
        </div>
        <div className={styles.codeBg}>
          <pre>{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}</pre>
        </div>
        <h2 className={`${styles.h} ${styles.category}`} id="APIs">APIs</h2>
        <div className={styles.toolBlock}>
          <ToolLogo src="/musicbrainz_logo.png" alt="MusicBrainz Logo" width={360} height={106} />
          <div className={styles.text}><h3>MusicBrainz API</h3></div>
        </div>
        <div className={styles.codeBg}>
          <pre>{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}{pre}</pre>
        </div>
        <div className={`${styles.toolBlock} ${styles.toolBlockAlt}`}>
          <ToolLogo src="/netlify_logo.png" alt="Netlify Logo" width={375} height={100} />
          <div className={`${styles.text} ${styles.faText}`}><h3>Netlify API</h3></div>
        </div>
        <h2 className={`${styles.h} ${styles.category}`}>Design</h2>
        <div className={styles.toolBlock}>
          <ToolLogo src="/fontawesome_logo.png" alt="FontAwesome Logo" width={400} height={80} />
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