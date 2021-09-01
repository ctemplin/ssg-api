import urlSlug from 'url-slug'

function extractSlugs(path) {
  return path.slice(0, path.indexOf('?')).split('/').filter(_=>_)
}

function joinSlugs(oldSlugs, newSlugs) {
  let jointSlugs = oldSlugs
  // overwrite dupe slugs
  jointSlugs = jointSlugs.map((a,i) => newSlugs[i] ?? a)
  // concat unique new slugs
  jointSlugs = jointSlugs.concat(newSlugs.slice(jointSlugs.length))
  // truncate old slugs
  jointSlugs = jointSlugs.slice(0, newSlugs.length)
  return jointSlugs
}

function joinParams(oldp, newp, purgeParams) {
  purgeParams.forEach(key => {
    if(oldp[key]) { delete oldp[key] }
  })
  const joint = {...oldp, ...newp}
  Object.keys(joint).forEach(k => {if (!(newp[k] ?? null)) {delete joint[k]} })
  return new URLSearchParams(joint)
}

export function slugify(valuesToSlugify) {
  if (valuesToSlugify == null) return
  let finalSlug
  switch (typeof valuesToSlugify) {
    case "string":
      finalSlug = urlSlug(valuesToSlugify)
      break
    case "object":
      if (typeof valuesToSlugify.map == "function") {
        finalSlug = valuesToSlugify
          .filter(c => c.text)
          .map(c => urlSlug(c.text, c.options))
          .filter(s => s) // filter again? yeah '??' countries slug to empty
          .join('_')
        break
      }
    default:
      // for completeness, should never be called
      finalSlug = urlSlug(valuesToSlugify.toString())
  }
  return finalSlug
}

export  {UPPERCASE_TRANSFORMER as UPCASE} from 'url-slug'

export function getRouterArgs(router, newSlugs, newParams) {
  const slugs = joinSlugs(extractSlugs(router.asPath), newSlugs)
  const queryString = joinParams(router.query, newParams, ["all"])

  return [
    `/?${queryString}`,
    slugs.reduce((p, n) => `${p}/${n}`, '') + `?${queryString}`,
    {shallow: true}
  ]
}