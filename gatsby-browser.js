require('./src/styles/reset.css')
require('./src/styles/tufte.css')
require('./src/styles/markdown.css')
require('prismjs/themes/prism.css')
require('github-markdown-css/github-markdown.css')

if (typeof global.navigator === 'undefined') {
  global.navigator = {}
}
