---
title: Hits and Damage in Multiplayer Games in Unity
date: '2024-10-04T00:01:00'
published: true
slug: hits-and-damage-in-multiplayer-games-in-unity
comments: https://github.com/jeffrafter/jeffrafter.github.io/issues/42
image: ../../assets/oculus-quest-2.jpg
layout: post
tags: ['hits', 'damage', 'oculus', 'quest', 'unity', 'development', 'vr', 'virtual-reality', 'multiplayer']
category: development
excerpt: After getting started with Unity and Virtual Reality, you now have a world. You've made it multiplayer with Normcore and are hanging out with your friends. To turn this into a game you need to introduce hits and damage.
---

<figure class="fullwidth">
![Oculus Quest with Controllers](../../assets/oculus-quest-2.jpg)
</figure>
<figcaption class="fullwidth">
Image credit: <a href="https://oculus.com">Oculus Quest</a>
</figcaption>

After [getting started with Unity and Virtual Reality](./getting-started-with-unity-and-vr), you now have a world. You've made it [multiplayer with Normcore](./unity-multiplayer-vr-with-normcore) and are hanging out with your friends. To turn this into a game you need to introduce hits and damage.

> Preamble: The implementation of damage in this post is not perfect. There are a lot of tradeoffs in multiplayer games where you need to decide if you want to trust the client or the server. This post is a starting point for understanding how to implement hits and damage in Unity. In this post we will trust the client and skip validation on the server (which should be done in a real game). We will also attempt to allow the owner to control their own health (which is a security risk in a real game) and simulate the physics of projectiles. It feels the best and works well for a small group of friends playing together.

## Ownership

As we've mentioned before in [Unity Multiplayer VR with Normcore](./unity-multiplayer-vr-with-normcore), we need to understand ownership. In Normcore, all shared objects have a `Realtime View` and movable objects have a `Realtime Transform`.Generally these objects have a single owner who is allowed to update their values. All other clients receive updates from the owner and interpolate between them.

This is important because we want to allow the owner to control their own health. We'll create an `AvatarAttributes` model that will be owned by the player and will be responsible for updating their health. This model will be shared with all clients and will be responsible for updating the health of the player.

The problem comes about when I try to shoot you. I create a projectile (like a bullet or arrow) and send it to you. I'll be updating the Realtime Position of the projectile on my client and you'll be receiving those updates and interpolating any gaps. If my projectile hits you, I am not allowed to update your health. I can only update my own health. So how do we handle this?

One option is to allow you to check if the projectile hits you on each frame. Unfortunately this is not very efficient and can lead to a lot of false misses. Suppose for example that I shoot you and the projectile is moving very fast. If you only check once per frame, you might miss the projectile entirely. If you check more frequently, you might hit the projectile multiple times. This is not ideal.

Instead we'll use a `Hit` model that will be owned by the player that is hit, but created by the player that is shooting. This model will be responsible for hitting player and updating their health.

## Attributes and synchronization
## Firing
### Projectiles
#### Physics
### Hits
#### Tracking impacts
#### Damage
## Shared game object
