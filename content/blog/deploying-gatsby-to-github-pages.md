---
title: Deploying Gatsby to GitHub Pages
date: '2019-06-01T00:01:00'
published: false
layout: post
tags: ['javascript', 'typescript', 'node', 'gatsby', 'github', 'pages']
category: Web
---

## Create a repository on github

If you don't already have an account on GitHub, create one. For me, my username is
[jeffrafter](https://github.com/jeffrafter). You can sign up for a free account and still host your
blog.

> **Note**: by default, your username will be part of the URL for your blog. We can change
> that later.

Next, create a new repository and name the repository `<your_user_name>.github.io`. For me, I've
named mine `jeffrafter.github.io`.[^org-pages]

[^org-pages]:

  You might already have a GitHub Pages site for your username. Did you know you can create a pages
  site for an organization? Check out the [documentation](https://help.github.com/en/articles/user-organization-and-project-pages#user-and-organization-pages-sites). It works exactly the same
  as a user-based GitHub Pages site. You can create a public organization for free and connect it
  to your existing account; log in and press the `+` in the header and choose `New organization`.

## Build and push

Once you've created the repository you need to add it as an `origin` to your local copy:

```bash
 git remote add origin git@github.com:your-user-name/your-user-name.github.io.git
 git push -u origin master
```

Again, using [GitHub Desktop](https://desktop.github.com/) can simplify pushing code as it manages
your login.

## Pull requests and branches

## Custom domains
