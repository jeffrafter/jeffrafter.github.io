---
title: Realtime and multiplayer
date: '2020-09-01T00:01:00'
published: false
slug: realtime-and-multiplayer
comments: https://github.com/jeffrafter/jeffrafter.github.io/issues/12
image: ../../assets/OpenGLInsights-TileBasedArchitectures.png
layout: post
tags: ['multiplayer', 'realtime', 'websockets']
category: web
excerpt: Realtime and multiplayer is tough, these are notes.
---

# Multiplayer

#howto #research

## In Unreal

https://docs.unrealengine.com/en-US/Gameplay/Networking/index.html
In blueprints https://docs.unrealengine.com/en-US/Gameplay/Networking/Blueprints/index.html
https://wiki.unrealengine.com/Dedicated_Server_Guide_(Windows_%26_Linux)#2._Hosting_on_a_virtual_server
https://www.youtube.com/watch?v=_XW9oI36kTE

## In Unity

Photon (Unity multiplayer) https://www.photonengine.com/en-US/PUN/pricing
Mirror (Unity multiplayer networking) https://github.com/vis2k/Mirror (works for MMORPG)
Normcore (Unity multiplayer) https://normcore.io

## In Web-based games

- WebSockets \* AppSync / APIGW+WS / Pusher

- WebRTC
  _ Peer-to-peer
  _ Host-clients
  _ Star-topology
  _ With data
  _ With audio
  _ With video
  _ STUN server
  _ TURN server

Custom direct socket

## Twitch

https://blog.twitch.tv/en/2015/12/18/twitch-engineering-an-introduction-and-overview-a23917b71a25/

Cloudflare Video Streaming:
Streaming: $1 per thousand minutes viewed
Storage: $5 per thousand minutes of video stored

https://en.wikipedia.org/wiki/HTTP_Live_Streaming#Low_Latency_HLS
https://www.twitch.tv/videos/92636123?t=03h13m46s
https://mux.com/blog/thursday-night-football-streaming-technology-showdown-amazon-prime-vs-twitch/

# Websockets on AWS with Lambda

## Resources:

- Overview: https://serverless.com/blog/api-gateway-websockets-support/
- How to (Chat application): https://www.freecodecamp.org/news/real-time-applications-using-websockets-with-aws-api-gateway-and-lambda-a5bb493e9452/
- Patch service: https://hackernoon.com/websockets-api-gateway-9d4aca493d39 (older post)
- Fanout: https://hackernoon.com/serverless-websockets-with-aws-lambda-fanout-15384bd30354 (2018, complex, MQTT and IoT core)
- Using Serverless, Packages and Plugins: https://medium.com/@chrissullivan.dev/aws-lambda-websockets-9f10f667154f (see edit at end)
- Pros and Cons and why it won't work for millions of clients: https://medium.com/dazn-tech/aws-serverless-websockets-at-scale-8a79cd5a9f3b

* Really good article with Cognito: https://medium.com/swlh/implementing-secure-web-sockets-with-aws-api-gateway-cognito-dynamodb-and-lambda-b38e02314b42
* ⭐️ Really simple article (single handler) https://blog.neverendingqs.com/2019/07/01/serverless-websocket-example.html

## AppSync and pure Websockets (re:Invent 2019)

- Amplify with AppSync https://aws.amazon.com/blogs/mobile/appsync-realtime/ (with React Example, very simple)
- Gastby Plugin example: https://www.gatsbyjs.org/packages/gatsby-plugin-appsync/

# Pricing

Goals:

- Multiple concurrent games running with 10 clients (8 players, 1 observer or host) .
- Ideally there could be 10000 concurrent games

Games are run in turns and actions

### Example: Multiplayer Dungeon Crawler

4 encounters
10 monsters + 8 players + 1dm
8 moves per encounter
10x status updates per move

Total: 6000

- 50 Encounters
- 10 monsters
- 10 moves each
- 100 updates

5,000,000 messages per game.

### AppSync

https://aws.amazon.com/appsync/pricing/

$4.00 per million query and data modification messages
$2.00 per million updates
\$0.08 per million minutes of connection to the AWS AppSync service

\$10-15 per month per game

The Free Tier offers the following monthly usage levels at no charge for 12 months after you sign up for an AWS account.

- 250,000 query or data modification operations
- 250,000 real-time updates
- 600,000 connection-minutes

### WebSocket over API Gateway

https://aws.amazon.com/api-gateway/pricing/#WebSocket_APIs

$1.00 per million
$0.25 per million connection minutes

(First 12 months, 1M free per month, 750K connection minutes per month)

### Pusher

Min \$49 per month

### Photon (Unity multiplayer)

https://www.photonengine.com/en-US/PUN/pricing

20 CCU is free.

### Mirror (Unity multiplayer networking)

https://github.com/vis2k/Mirror

### WebRTC ?

### Quiplash

```
8: Player Joined (the will submit everybody's in, possibly not in ws)
1: Round 1 starts
16:  8 questions x2 (they will submit 16 answers, possibly not in ws)
8: player ready

36 (2 rounds)
	18: (
		1: voting starts
		16: (
		  1: Show question (they will submit 6 votes, possibly not in ws)
		  1: Show winner
		)
		1: Show end round,
	  )

  8: send everyone a question (the will submit answers X8)
  1: show answers (they will submit 3 votes each)
  1: show winner

  1: show overall winner, game done
```

Total: 80 messages per game

### More useful links

- Terraform Loops and Counts and For Each: https://blog.gruntwork.io/terraform-tips-tricks-loops-if-statements-and-gotchas-f739bbae55f9
- Protecting WebSockets: https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-protect.html
- Cognito: https://medium.com/swlh/implementing-secure-web-sockets-with-aws-api-gateway-cognito-dynamodb-and-lambda-b38e02314b42
- Simple and Good: https://blog.neverendingqs.com/2019/07/01/serverless-websocket-example.html
