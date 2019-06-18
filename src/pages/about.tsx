import React from 'react'
import {graphql} from 'gatsby'

import Layout from '../components/layout'
import Head from '../components/head'

interface Props {
  readonly data: PageQueryData
}

export default class Tags extends React.Component<Props> {
  render() {
    const {data} = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout title={siteTitle}>
        <Head title="All tags" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />
        <article>
          <p>👋 Hi.</p>
          <p>
            I'm Jeff. I'm a Senior Software Engineer <strong>@GitHub.</strong> where I get to invent
            and work and play all at the same time. I have a great family (Ali, Jude &amp; Gavin)
            and a great dog (Stella). I studied Creative Writing and English Literature at the
            University of Iowa and once upon a time wrote some techinical books.
          </p>
        </article>
      </Layout>
    )
  }
}

interface PageQueryData {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
