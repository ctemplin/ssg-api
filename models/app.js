import {  atom, selector } from 'recoil'

export const appNamesAtom = atom({
    key: 'appNamesAtom',
    default: {
      short: "MbEx",
      long:  "MusicBrainz Explorer"
    }
  })
  
export const pageTitleTemplates = selector({
  key: 'pageTitleTemplates',
  get: ({get}) => {
    const names = get(appNamesAtom)
    return {
      short: names.short + " - ",
      long:  names.long + " - Search for your Sound"
    }
  }
})