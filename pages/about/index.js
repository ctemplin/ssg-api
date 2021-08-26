import { Fragment, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { appNamesAtom } from '../../models/app'
import fetchData from '../../data/fetcher'
import HeadTag from '../../components/head'
import ToolLogo from '../../components/toolLogo'
import styles from '../../styles/About.module.sass'
import { recoilExample } from './recoilExample'
import { nextjsExample } from './nextjsExample'
import { musicbrainzExample } from './musicbrainzExample'

export async function getStaticProps(context) {

  const resultMapper = (json) => {
    let deploys = json.filter(_ => ["ready", "building"].includes(_.state))
    var dtFmt = Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    const mostRecentDate = dtFmt.format(new Date(deploys[0].created_at)) 
    dtFmt = Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'medium' })
    deploys = deploys.map(_ => (
      { id:         _.id,
        createdAt:  dtFmt.format(new Date(_.created_at)),
        state:      _.state,
        title:      _.title,
        branch:     _.branch }
    ))
    return {
      props: {title: 'About', mostRecentDate: mostRecentDate, deploys: deploys},
      revalidate: false
    }
  }

  const results = await fetchData(
    `https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/deploys`,
    [['page', '1'], ['per_page', '40']],
    resultMapper,
    {
      'User-Agent': 'mb.christemplin.com (ctemplin@gmail.com)',
      'Authorization': `Bearer ${process.env.NETLIFY_OAUTH_TOKEN}`,
      'Accept': 'application/json'
    }
  )
  return results
}

export default function About({title, mostRecentDate, deploys}) {

  const appNames = useRecoilValue(appNamesAtom)
  const st = useRef(0)
  useEffect(() => {
    const onBgScroll = (e) => {
      e.preventDefault() // allow bubble
    }

    const onScroll = (e,) => {
      var doc = document
      if (e.eventPhase !== 2) return

      var sEl = e.srcElement.scrollingElement ?? e.srcElement
      var dir = sEl.scrollTop < st.current ? 'up' : 'down'
      var codeBlocks = doc.querySelectorAll('.' + styles.codeBg)
      codeBlocks.forEach((el) => {
        if (el.offsetTop - st.current < sEl.clientHeight) {
          el.children[0].scrollBy(0, dir === 'up' ? -1 : 1)
          el.children[1].scrollBy(0, dir === 'up' ? -3 : 3)
        }
      })

      if (sEl.scrollTop > st.current) {
        var toolBlocks = doc.querySelectorAll('.' + styles.toolBlock)
        toolBlocks.forEach((el) => {
          var n = el.offsetTop - sEl.scrollTop
          var body = doc.scrollingElement.scrollTop > 0 ? 
            doc.scrollingElement : doc.body
          if (n < window.innerHeight*.6 || 
            body.scrollHeight - body.scrollTop <= window.innerHeight + 10 ) {
            el.classList.add(styles.toolBlockFocus)
          }
        })
      }
      else if (sEl.scrollTop === 0) {
        var toolBlocks = doc.querySelectorAll('.' + styles.toolBlock)
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


  return (
    <>
    <HeadTag title={title} />
    <div className={styles.container}>
      <div className={styles.column}>

        <h1 className={styles.h}>About {appNames.long} ({appNames.short})</h1>
        <details>
          <summary><em>Last updated on:</em> <time>{mostRecentDate}</time></summary>
          <dl className={styles.deploysDl}>
          {deploys.map(_=>
            <Fragment key={_.id}>
              <dt>{_.createdAt}</dt>
              <dd>{_.title}</dd>
            </Fragment>
          )}
          </dl>
        </details>
        <p>Thanks for using the app! We hope you find it useful.</p>
        <p>Read on for details about some of the many fine tools we used to create it.</p>

        <h2 className={`${styles.h} ${styles.category}`}>Packages</h2>
        <div className={styles.toolBlock} id="nextjsBlock">
          <ToolLogo src="/nextjs_logo.png" alt="NextJs Logo"
            width={360} height={190}
            url="https://github.com/vercel/next.js#readme" />
          <div className={styles.text}>NextJS is React for &ldquo;static&rdquo; sites. This allows for on-demand, CDN-based deployments. Most of the dynamic data used in {appNames.short} is requested directly by the browser (<a href="#APIs">see APIs</a> for MusicBrainz). Other API calls (Youtube, etc.) require private credentials. Such API calls are hosted as on-demand server functions.
          </div>
        </div>
        <div className={styles.codeBg}>
          <div>
            <pre>{nextjsExample.body}</pre>
          </div>
          <div>
            <pre>{nextjsExample.body}</pre>
          </div>
        </div>
        <div className={`${styles.toolBlock} ${styles.toolBlockAlt}`}>
          <ToolLogo src="/recoiljs_logo.png" alt="RecoilJs Logo"
            width={375} height={125} hasBorder={true} color="blue"
            url="https://github.com/facebookexperimental/Recoil#readme" />
          <div className={styles.text}>There&apos;s no shortage of alternatives to React&apos;s solid but decentralized state management. Recoil is not only officially blessed by, creator of React, Facebook, it also has many features to recommend it. MbEx benefits from Recoil&apos;s easy handling of asynchronous data fetching and automatic caching among other features.</div>
        </div>
        <div className={styles.codeBg}>
          <div>
            <pre>{recoilExample.body}</pre>
          </div>
          <div>
            <pre>{recoilExample.body}</pre>
          </div>
        </div>
        <h2 className={`${styles.h} ${styles.category}`} id="APIs">APIs</h2>
        <div className={styles.toolBlock}>
          <ToolLogo src="/musicbrainz_logo.png" alt="MusicBrainz Logo"
            width={360} height={106} hasBorder={true} color="orange"
            url="https://musicbrainz.org/doc/MusicBrainz_API" />
          <div className={styles.text}>MusicBrainz API is great to work with. Absolutely minimal credential hurdles to clear, a consistent data structure, and the option to include entity relationships makes drilling down into the data simple with minimal network calls. </div>
        </div>
        <div className={styles.codeBg}>
          <div>
            <pre>{musicbrainzExample.body}</pre>
          </div>
          <div>
            <pre>{musicbrainzExample.body}</pre>
          </div>
        </div>
        <div className={`${styles.toolBlock} ${styles.toolBlockAlt}`}>
          <ToolLogo src="/netlify_logo.png" alt="Netlify Logo"
            width={375} height={100} hasBorder={true} color="teal" 
            url="https://open-api.netlify.com" />
          <div className={`${styles.text}`}><h3>Netlify API</h3></div>
        </div>
        <h2 className={`${styles.h} ${styles.category}`}>Design</h2>
        <div className={styles.toolBlock}>
          <ToolLogo src="/fontawesome_logo.png" alt="FontAwesome Logo"
            width={400} height={80}
            url="https://github.com/FortAwesome/Font-Awesome#readme" />
          <div className={`${styles.text}`}><h3>FontAwesome</h3></div>
        </div>
      </div>
    </div>
    </>
  )
}