import React from 'react'
import {Link, graphql} from 'gatsby'

import Layout from '../components/layout'
import Head from '../components/head'
import Bio from '../components/bio'
import {styled} from '../styles/theme'

const Container = styled('div')`
  margin-top: 100px;
`

interface Props {
  readonly data: PageQueryData
}

const Tags: React.FC<Props> = ({data}) => {
  const siteTitle = data.site.siteMetadata.title
  const siteKeywords = data.site.siteMetadata.keywords
  const group = data.allMarkdownRemark && data.allMarkdownRemark.group

  return (
    <Layout title={siteTitle}>
      <Head title={siteTitle} keywords={siteKeywords} />
      <Bio />
      <Container>
        <article>
          <h1>All tags</h1>
          <div className={`page-content`}>
            {group &&
              group.map(
                tag =>
                  tag && (
                    <div key={tag.fieldValue}>
                      <h3>
                        <Link to={`/tags/${tag.fieldValue}/`}>{tag.fieldValue}</Link>
                      </h3>
                      <small>
                        {tag.totalCount} post
                        {tag.totalCount === 1 ? '' : 's'}
                      </small>
                    </div>
                  ),
              )}
          </div>
        </article>
      </Container>
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
  allMarkdownRemark: {
    group: {
      fieldValue: string
      totalCount: number
    }[]
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
    allMarkdownRemark(filter: {frontmatter: {published: {ne: false}}}) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`

export default Tags
