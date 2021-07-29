
export default function formatDate(dt) {
  // If date is just a 4-digit year, take it. Otherwise format it.
  const date = dt?.match(/^\d{4}$/) ? dt :
    new Date(dt).toLocaleDateString(
      "us-EN",
      {year: 'numeric', month: 'short', day: 'numeric', timeZone: "UTC"}
    )
  return date == "Invalid Date" ? null : date
}

export function extractYear(dt) {
  return dt?.length ? new Date(dt).getUTCFullYear() : undefined
}

export function sortDateStrings(a,b) {
  return Date.parse(a) - Date.parse(b)
}

export function formatMilliseconds(ms) {
  var mins = Math.floor(ms/60000)
  var secs = Math.floor((ms % 60000) / 1000)
  secs = secs.toString().padStart(2,'0')
  return `${mins}:${secs}`
}