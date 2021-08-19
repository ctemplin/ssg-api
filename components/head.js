import NextHead from 'next/head'
import { useRecoilValue } from 'recoil'
import { dynamicPageTitle } from '../models/musicbrainz'

export default function Head({title}) {
  const pageTitle = useRecoilValue(dynamicPageTitle(title))

  return (
    <NextHead>
      <title>{pageTitle}</title>
      <meta name="description"
        content="Explorer for Artists, Albums and Songs from MusicBrainz" />
      <link rel="icon" href="/favicon.ico" />
      <style>html,body {`{
        color: #4a4a4a;
        font-size: 1em;
        font-weight: 400;
        line-height: 1.5;
        height: 100% !important;
        overflow-y: overlay !important;
      }`}</style>
    </NextHead>
  )
}