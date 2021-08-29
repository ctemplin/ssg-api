import { rest } from 'msw'
import releaseNoMediaMock from './release_no-media_mock.json'

export const handlers = [
  rest.get('https://musicbrainz.org/ws/2/release/553912a9-2b42-40da-98ea-d8c2e63b9dfb', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(releaseNoMediaMock),
    )
  }),
]