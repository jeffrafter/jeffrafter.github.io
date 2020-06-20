import React from 'react'
import {StaticQuery, graphql} from 'gatsby'

type StaticQueryData = {
  site: {
    siteMetadata: {
      description: string
      social: {
        twitter: string
        instagram: string
        github: string
      }
    }
  }
}

const Bio: React.FC = () => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            description
            social {
              twitter
              instagram
              github
            }
          }
        }
      }
    `}
    render={(data: StaticQueryData): React.ReactElement | null => {
      const {description, social} = data.site.siteMetadata
      return (
        <div>
          <h1>{description}</h1>
          <p>
            By Jeff Rafter
            <br />
            <a href={social.twitter} rel="noopener noreferrer">
              Twitter
            </a>
            {' / '}
            <a href={social.instagram} rel="noopener noreferrer">
              Instagram
            </a>
            {' / '}
            <a href={social.github} rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </div>
      )
    }}
  />
)

export default Bio
