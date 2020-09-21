---
title: Using Express and Amazon Web Services
date: '2020-09-22T00:01:00'
published: false
slug: express-and-aws
comments: https://github.com/jeffrafter/jeffrafter.github.io/issues/14
image: ../../assets/terraform.jpg
layout: post
tags: ['gatsby', 'aws', 'express', 'gatsby']
category: Web
excerpt: There are a lot of options for configuring AWS. Terraform from Hashicorp is a tool for configuring remote infrastructure. You can create Terraform configuration files and treat your infrastructure as code; versioning the changes and storing your settings in your repository.
---

<figure class="fullwidth">
![Terraform + AWS](../../assets/terraform.jpg)
</figure>
<figcaption class="fullwidth">
Image credit: <a href="https://terraform.io" rel="noopener noreferrer">Hashicorp's Terraform</a>
</figcaption>

# API

Currently our API is very simple. It is a single JavaScript file that logs the `context` that it received.

# Deploying

- Changes to the server
- Changes to the client
