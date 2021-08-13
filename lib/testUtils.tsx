import { render, RenderOptions, RenderResult } from '@testing-library/react'
import React, { ReactElement } from 'react'
import { RecoilRoot } from 'recoil'

const Providers: React.FC<Object> = (props) => {
  return (
      <RecoilRoot>{props.children}</RecoilRoot>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): RenderResult =>
  render(ui, { wrapper: Providers,  ...options })

export * from '@testing-library/react'

export { customRender as render }
