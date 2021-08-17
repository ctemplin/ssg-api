import fetchData from './fetcher'

export async function artistSearch(terms) {
  const resultMapper = (json) => {
    return ({ matches:
        json.artists.map(artist => {
          return {id: artist.id, name: artist.name}
        })
      }
    )
  }

  const results = await fetchData(
    'https://musicbrainz.org/ws/2/artist',
    [
      ["query", terms],
      ["limit", 20],
      ["offset", 0]
    ],
    resultMapper
  )
  return results
}

export async function artistLookup(id) {
  const resultMapper = (json) => {
    return ({
      id: id,
      name: json.name,
      lsBegin: json['life-span']?.begin,
      lsEnd: json['life-span']?.end,
      releaseGroups:
        json['release-groups'].map(album => {
          return {
            id: album.id,
            title: album.title,
            type1: album['primary-type'],
            type2: album['secondary-types']?.[0] ?? null,
            firstReleaseDate: album['first-release-date']
          }
        })
      })
  }

  const results = await fetchData(
    `https://musicbrainz.org/ws/2/artist/${id}`,
    [["inc", "release-groups"]],
    resultMapper
  )
  return results
}

export async function releaseGroupLookup(id) {
  const resultMapper = (json) => {
    return ({
      id: json.id,
      title: json.title,
      firstReleaseDate: json['first-release-date'],
      releases:
        json['releases'].map(release => {
          return {
            id: release.id,
            title: release.title,
            date: release['date'],
            country: release.country || "??"
          }
        })
      })
  }

  const results = await fetchData(
    `https://musicbrainz.org/ws/2/release-group/${id}`,
    [["inc", "releases"]],
    resultMapper
  )
  return results
}

export async function releaseLookup(id) {
  const resultMapper = (json) => {
    return ({
      id: json.id,
      title: json.title,
      date: json.date,
      country: json.country,
      hasCoverArt: json['cover-art-archive']?.artwork,
      tracks:
      json.media?.[0]?.tracks?.map(track => {
        return {
          id: track.id,
          rid: track.recording?.id,
          title: track.title,
          position: track.position,
          length: track.length,
        }
      })
    })
  }

  const results = await fetchData(
    `https://musicbrainz.org/ws/2/release/${id}`,
    [["inc", "recordings"]],
    resultMapper
  )
  return results
}

export async function recordingLookup(id) {
  const resultMapper = (json) => {
      return ({
        id: json.id,
        title: json.title,
        disambiguation: json.disambiguation,
        firstReleaseDate: json['first-release-date'],
        length: json.length,
        video: json.video,
        artistCredits: json['artist-credit']
      })
  }

  const results = await fetchData(
    `https://musicbrainz.org/ws/2/recording/${id}`,
    [["inc", "artist-credits"]],
    resultMapper
  )
  return results
}