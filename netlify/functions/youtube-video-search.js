const { faUserLock } = require('@fortawesome/free-solid-svg-icons')

exports.handler = async function(event, context) {
  
  const fetch = require('node-fetch')

  const url = new URL('https://youtube.googleapis.com/youtube/v3/search')
  url.searchParams.append('key', process.env.YOUTUBE_API_KEY) //process.env.YOUTUBE_APIKEY)
  url.searchParams.append('part', 'snippet')
  url.searchParams.append('type', 'video')
  url.searchParams.append('videoEmbedabble', 'true')
  url.searchParams.append('q', event.queryStringParameters.q)
  // log to netlify functions dashboard
  console.log(url.toString())
  const resp = await fetch(url)
  const json = await resp.json()
  
  return {
    statusCode: 200,
    body: JSON.stringify(json)
  };
}