import * as React from 'react'

import Page from '../components/Page'
import Container from '../components/Container'
import IndexLayout from '../layouts'

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <h1>This is about Jeff Rafter</h1>
        <p>Normal. Fam. Works at GitHub</p>
      </Container>
    </Page>
  </IndexLayout>
)

export default IndexPage
