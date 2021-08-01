import React, { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

const withMbz = (Component) => ({lookup, atom, dispSel}) => {

  const [isLoading, setIsLoading] = useState(true)
  const [errored, setErrored] = useState(false)
  const [errorMsg, setErrorMsg] = useState()
  const [atomValue, setAtom] = useRecoilState(atom)
  const dataFetcher = useRecoilValueLoadable(lookup(atomValue.id))
  const dispData = useRecoilValue(dispSel)
  
  useEffect(() => {
    if (!dataFetcher) return;
    switch (dataFetcher.state) {
      case 'loading':
        break;
      case 'hasValue':
        setAtom(dataFetcher.contents)
        setIsLoading(false)
        setErrorMsg(null)
        setErrored(false)
        break;
      case 'hasError':
        setIsLoading(false)
        setErrorMsg(dataFetcher.contents.message)
        setErrored(true)
      default:
        break;
    }
  },[atomValue.id, dataFetcher?.state])

  return <Component
           dispData={dispData} isLoading={isLoading}
           errored={errored} errorMsg={errorMsg} />
}

export default withMbz
