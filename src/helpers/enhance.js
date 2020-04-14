import React from 'react';
import { compose, defaultProps, branch, renderComponent } from 'recompose'

export const enhance = compose(
  defaultProps({
    isLoading: false
  }),

  branch(
    ({ isLoading }) => !isLoading,
    renderComponent(loading),
    renderComponent(renderData)
  )
)

function loading({ isLoading }) {
  return (
    <div>
      <h1>{isLoading} loading ...</h1>
    </div>
  )
}

function renderData({ isLoading }) {
  return (
    <div>
      <h1>{isLoading} data success</h1>
    </div>
  )
}

// export default enhance