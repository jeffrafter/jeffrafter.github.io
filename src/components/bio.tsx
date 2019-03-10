import React from 'react'
import {StaticQuery, graphql} from 'gatsby'

type StaticQueryData = {
  site: {
    siteMetadata: {
      description: string
      social: {
        twitter: string
      }
    }
  }
}

export default function() {
  return (
    <StaticQuery
      query={graphql`
        query {
          site {
            siteMetadata {
              description
              social {
                twitter
              }
            }
          }
        }
      `}
      render={(data: StaticQueryData) => {
        const {description, social} = data.site.siteMetadata
        return (
          <div>
            <h1>{description}</h1>
            <p>
              By Jeff Rafter
              <br />
              <a href={social.twitter}>Twitter</a>
            </p>
          </div>
        )
      }}
    />
  )
}
