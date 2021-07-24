import urlSlug from 'url-slug'

function joinSlugs(path, newSlugs) {
  let slugs = path.slice(0, path.indexOf('?')).split('/').filter(_=>_)
  // overwrite dupe slugs
  slugs = slugs.map((a,i) => newSlugs[i] ?? a)
  // concat unique new slugs
  slugs = slugs.concat(newSlugs.slice(slugs.length))
  // truncate old slugs
  slugs = slugs.slice(0, newSlugs.length)
  return slugs
}

function joinParams(oldp, newp, purgeParams) {
  purgeParams.forEach(key => {
    if(oldp[key]) { delete oldp[key] }
  });
  const joint = {...oldp, ...newp}
  for (var p in joint) { if (newp[p] === null) {delete joint[p]}}
  return new URLSearchParams(joint)
}

export function getPushArgs(router, newSlugs, newParams) {
  const slugs = joinSlugs(router.asPath, newSlugs)
  const queryString = joinParams(router.query, newParams, ["all"])

  return [
    `/?${queryString}`,
    slugs.reduce((p, n) => p + `/${urlSlug(n)}`, '') + `?${queryString}`,
    {shallow: true}
  ]
}