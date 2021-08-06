import React, { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

const withMbz = (InnerComponent) => {
  const OuterComponent = ({lookup, atom, dispSel, dispParams}) => {

  const [isLoading, setIsLoading] = useState()
  const [errored, setErrored] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [atomValue, setAtom] = useRecoilState(atom)
  const [params, setParams] = useState(dispParams)
  const dataFetcher = useRecoilValueLoadable(lookup(atomValue.id))
  const dispData = useRecoilValue(dispParams ? dispSel(params) : dispSel)

  useEffect(() => {
    switch (dataFetcher.state) {
      case 'loading':
        setIsLoading(true)
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
  },[atomValue.id, dataFetcher.state, dataFetcher.contents, atomValue, setAtom])

  const handleParamsChange = (params) => setParams(params)

  return <InnerComponent
           dispData={dispData}
           errored={errored} errorMsg={errorMsg}
           isLoading={isLoading}
          />
}
  OuterComponent.displayName = `WithMbz(${InnerComponent.name})`
  return OuterComponent
}

export default withMbz
