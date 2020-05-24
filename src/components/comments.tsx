import React from 'react'

interface Props {
  readonly url: string
}

export default class Comments extends React.Component<Props> {
  render(): React.ReactNode {
    return <div>Comments</div>
  }
}
