import { rest } from 'msw'
import releaseMock from './release_mock.json'
import releaseNoMediaMock from './release_no-media_mock.json'

export const handlers = [
  rest.get('https://musicbrainz.org/ws/2/release/:rid/', (req, res, ctx) => {
    let resBody
    switch (req.params.rid) {
      case 'deec603f-bb01-4094-b538-25e5fe62ed86':
        resBody = releaseMock
        // temp fix, prevent coverArtThumbnail from rendering
        resBody['cover-art-archive'] = {
          "count": 4,
          "back": false,
          "darkened": false,
          "front": false,
          "artwork": false
        }
        break;
      case '553912a9-2b42-40da-98ea-d8c2e63b9dfb':
        resBody = releaseNoMediaMock
      default:
        break;
    }
    return res(
      ctx.status(200),
      ctx.json(resBody),
    )
  }),
]