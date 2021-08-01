import React, { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

const withMbz = (InnerComponent) => {
  const OuterComponent = ({lookup, atom, dispSel}) => {

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
  },[atomValue.id, dataFetcher?.state, dataFetcher, atomValue, setAtom])

  return <InnerComponent
           dispData={dispData} isLoading={isLoading}
           errored={errored} errorMsg={errorMsg} />
}
  OuterComponent.displayName = `WithMbz(${InnerComponent.name})`
  return OuterComponent
}

export default withMbz
