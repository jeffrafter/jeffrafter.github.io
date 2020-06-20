import React from 'react'
import {graphql} from 'gatsby'

import Layout from '../components/layout'
import Head from '../components/head'
import {Link} from '@reach/router'

interface Props {
  readonly data: PageQueryData
}

const NotFound: React.FC<Props> = ({data}) => {
  const siteTitle = data.site.siteMetadata.title
  const siteKeywords = data.site.siteMetadata.keywords

  return (
    <Layout title={siteTitle}>
      <Head title="Not found" keywords={siteKeywords} />
      <article>
        <p>🤔 Hmmm.</p>
        <p>We went looking everywhere for your page and we couldn’t find it. It will probably turn up sometime.</p>
        <p>
          <Link to={`/`}>Start over</Link>
        </p>
      </article>
    </Layout>
  )
}

interface PageQueryData {
  site: {
    siteMetadata: {
      title: string
      keywords: [string]
    }
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        keywords
      }
    }
  }
`

export default NotFound
