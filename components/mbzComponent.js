import React, { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

const withMbz = (InnerComponent) => {
  const OuterComponent = ({lookup, atom, dispSel, dispParams}) => {

  const [isLoading, setIsLoading] = useState(true)
  const [errored, setErrored] = useState(false)
  const [errorMsg, setErrorMsg] = useState()
  const [atomValue, setAtom] = useRecoilState(atom)
  const [params, setParams] = useState(dispParams)
  const dataFetcher = useRecoilValueLoadable(lookup(atomValue.id))
  const dispData = useRecoilValue(dispParams ? dispSel(params) : dispSel)

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
           errored={errored} errorMsg={errorMsg}
           selParams={params} setSelParams={setParams} />
}
  OuterComponent.displayName = `WithMbz(${InnerComponent.name})`
  return OuterComponent
}

export default withMbz
