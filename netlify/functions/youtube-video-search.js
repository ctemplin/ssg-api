exports.handler = async function(event) {

  const fetch = require('node-fetch')
  const url = new URL('https://youtube.googleapis.com/youtube/v3/search')
  url.searchParams.append('key', process.env.YOUTUBE_API_KEY)
  url.searchParams.append('part', 'snippet')
  url.searchParams.append('type', 'video')
  url.searchParams.append('videoEmbedabble', 'true')
  url.searchParams.append('maxResults', '6')
  url.searchParams.append('q', event.queryStringParameters.q)

  // log to netlify functions dashboard
  console.log(url.toString())
  const resp = await fetch(url)
  if (resp.status >= 200 && resp.status <= 299) {
    const json = await resp.json()

    return {
      statusCode: 200,
      body: JSON.stringify(json)
    }
  } else {
    console.log(`YouTube Response: Status ${resp.status} - ${resp.statusText}`)
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          statusCode: 500,
          statusText: "Function encountered an error. Request an admin to review log."
        }
      )
    }
  }
}