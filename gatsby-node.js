const path = require(`path`)
const {createFilePath} = require(`gatsby-source-filesystem`)

const isDevelopment = process.env.NODE_ENV === 'development'
console.log({isDevelopment})

exports.createPages = ({graphql, actions}) => {
  // Get the templates
  const postTemplate = path.resolve(`./src/templates/post.tsx`)
  const tagTemplate = path.resolve('./src/templates/tag.tsx')
  const publishedPromise = graphql(`
    {
      allMarkdownRemark(
        filter: {frontmatter: {published: {ne: false}}}
        sort: {fields: [frontmatter___date], order: DESC}
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags
              title
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create post pages
    const posts = result.data.allMarkdownRemark ? result.data.allMarkdownRemark.edges : []
    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      actions.createPage({
        path: post.node.fields.slug,
        component: postTemplate,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    // Iterate through each post, putting all found tags into `tags`
    let tags = []
    posts.forEach(post => {
      if (post.node.frontmatter.tags) {
        tags = tags.concat(post.node.frontmatter.tags)
      }
    })
    const uniqTags = [...new Set(tags)]

    // Create tag pages
    uniqTags.forEach(tag => {
      if (!tag) return
      actions.createPage({
        path: `/tags/${tag}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    })
  })

  const draftPromise = graphql(`
    {
      allMarkdownRemark(
        sort: {fields: [frontmatter___date], order: DESC}
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              published
              tags
              title
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create draft post pages
    const posts = result.data.allMarkdownRemark ? result.data.allMarkdownRemark.edges : []
    posts.forEach((post, index) => {
      if (!post.node.frontmatter.published && post.node.frontmatter.tags.indexOf('draft') >= 0) {
        actions.createPage({
          path: post.node.fields.slug,
          component: postTemplate,
          context: {
            slug: post.node.fields.slug
          },
        })
      }
    })
  })

  return Promise.all([publishedPromise, draftPromise])
}

exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({node, getNode})
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
