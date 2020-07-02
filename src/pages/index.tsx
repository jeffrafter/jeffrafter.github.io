import React from 'react'
import {Link, graphql} from 'gatsby'

import Layout from '../components/layout'
import Head from '../components/head'
import Bio from '../components/bio'
import {styled} from '../styles/theme'

const Container = styled('div')``

interface Props {
  readonly data: PageQueryData
}

const Index: React.FC<Props> = ({data}) => {
  const siteTitle = data.site.siteMetadata.title
  const siteKeywords = data.site.siteMetadata.keywords
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout title={siteTitle}>
      <Head title={siteTitle} keywords={siteKeywords} />
      <Bio />
      <Container>
        <article>
          <div className={`page-content`}>
            {posts.map(({node}) => {
              const excerpt = node.frontmatter.excerpt || node.excerpt
              const title = node.frontmatter.title || node.fields.slug
              return (
                <div key={node.fields.slug}>
                  <h3>
                    <Link to={node.fields.slug}>{title}</Link>
                  </h3>
                  <small>{node.frontmatter.date}</small>
                  <p dangerouslySetInnerHTML={{__html: excerpt}} />
                  <br />
                </div>
              )
            })}
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
    edges: {
      node: {
        excerpt: string
        fields: {
          slug: string
        }
        frontmatter: {
          excerpt?: string
          date: string
          title: string
        }
      }
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
    allMarkdownRemark(
      filter: {frontmatter: {published: {ne: false}}}
      sort: {fields: [frontmatter___date], order: DESC}
    ) {
      edges {
        node {
          excerpt(pruneLength: 2500)
          fields {
            slug
          }
          frontmatter {
            excerpt
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`

export default Index
