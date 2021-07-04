
export default function formatDate(dt) { 
  // If date is just a 4-digit year, take it. Otherwise format it.
  const date = dt?.match(/^\d{4}$/) ? dt : 
    new Date(dt).toLocaleDateString(
      "us-EN",
      {year: 'numeric', month: 'short', day: 'numeric', timeZone: "UTC"}
    )
  return date
}

export function extractYear(dt) {
  return dt?.length ? new Date(dt).getUTCFullYear() : undefined
}
