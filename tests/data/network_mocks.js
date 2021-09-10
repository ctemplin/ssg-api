import { rest } from 'msw'
import artistMock from './artist_mock.json'
import releaseGroupMock from './releaseGroup_mock.json'
import releaseMock from './release_mock.json'
import releaseNoMediaMock from './release_no-media_mock.json'
import coverArtArchiveMock from './coverArtArchive_mock.json'

export const handlers = [
  // Mocks the 307 (Temporary Redirect) from coverartarchive.org
  rest.get('https://coverartarchive.org/release/:rid/', (req, res, ctx) => {
    return res(
      ctx.status(307),
      ctx.set('location',
        `https://archive.org/download/mbid-:${req.params.id}/index.json`
      )
    )
  }),

  // Mocks the 302 (Found) reponse from archive.org
  rest.get('https://archive.org/download/mbid-:rid/index.json', (req, res, ctx) => {
    return res(
      ctx.status(302),
      ctx.set('location',
        `https://ia803206.us.archive.org/17/items/mbid-${req.params.id}/index.json`
      )
    )
  }),

  // Finally mocks the 200 response from archive.org and returns mock data
  rest.get('https://:lbNode.us.archive.org/:dirNum/items/mbid-:rid/index.json', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(coverArtArchiveMock)
    )
  }),

  rest.get('https://musicbrainz.org/ws/2/artist/:aid', (req, res, ctx) => {
    let resBody = artistMock
    return res(
      ctx.status(200),
      ctx.json(resBody)
    )
  }),

  rest.get('https://musicbrainz.org/ws/2/release-group/:rgid', (req, res, ctx) => {
    let resBody = releaseGroupMock
    return res(
      ctx.status(200),
      ctx.json(resBody)
    )
  }),

  rest.get('https://musicbrainz.org/ws/2/release/:rid/', (req, res, ctx) => {
    let resBody
    switch (req.params.rid) {
      case 'deec603f-bb01-4094-b538-25e5fe62ed86':
        resBody = releaseMock
        break
      case '553912a9-2b42-40da-98ea-d8c2e63b9dfb':
        resBody = releaseNoMediaMock
      default:
        break
    }
    return res(
      ctx.status(200),
      ctx.json(resBody),
    )
  })
]