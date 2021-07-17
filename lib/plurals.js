
const addS = ['album', 'single', 'ep', 'other', 'audio drama', 'audiobook', 'broadcast', 'compilation', 'soundtrack', 'spokenword', 'interview', 'live']
const addEs = ['dj-mix', 'remix']
// Unused but completes the list of MusicBrainz release types
const addNothing = ['other', 'mixtape/street']

export default function pluralize(str) {
    let lstr = str.toLowerCase()
    if (addS.includes(lstr)) {
        return str + 's'
    } else if (addEs.includes(lstr)) {
        return str + 'es'
    } else {
        return str
    }
}