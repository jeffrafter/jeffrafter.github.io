'use strict'

module.exports = {
  siteMetadata: {
    title: 'Jeff Rafter',
    description: 'How to.',
    keywords: ['jeffrafter', 'how-to', 'blog'],
    siteUrl: 'https://jeffrafter.com',
    author: {
      name: 'Jeff Rafter',
      url: 'https://twitter.com/jeffrafter',
      email: 'jeffrafter@gmail.com',
    },
    social: {
      twitter: 'https://twitter.com/jeffrafter',
      instagram: 'https://instagram.com/jeffrafter',
      github: 'https://github.com/jeffrafter',
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- excerpt -->`,
        plugins: [
          `gatsby-remark-tufte`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1280,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              aliases: {
                sh: 'bash',
                tf: 'ruby',
              },
            },
          },
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: `https://jeffrafter.com`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jeff Rafter`,
        short_name: `jeffrafter.com`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `static/logo-circle.png`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-61511214-2`,
      },
    },
    `gatsby-plugin-feed`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-typescript`,
    `gatsby-transformer-sharp`,
  ],
}
