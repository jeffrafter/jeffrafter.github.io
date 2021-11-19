---
title: Unity Multiplayer Virtual Reality with Normcore
date: '2021-10-16T00:01:00'
published: true
slug: unity-multiplayer-vr-with-normcore
comments: https://github.com/jeffrafter/jeffrafter.github.io/issues/42
image: ../../assets/oculus-quest-2.jpg
layout: post
tags: ['oculus', 'quest', 'unity', 'development', 'vr', 'virtual-reality', 'multiplayer']
category: development
excerpt: What's better than Virtual Reality? Virtual Reality with friends. Even the most basic games become more fun when played together. Learn how to quickly setup a multiplayer VR game with Normcore and Unity.
---

<figure class="fullwidth">
![Oculus Quest with Controllers](../../assets/oculus-quest-2.jpg)
</figure>
<figcaption class="fullwidth">
Image credit: <a href="https://oculus.com">Oculus Quest</a>
</figcaption>

What's better than Virtual Reality? Virtual Reality with friends. Even the most basic games become more fun when played together. Previously, we focused on [getting started with Unity and Virtual Reality](./getting-started-with-unity-and-vr). This post builds on top of that foundation: adding multiplayer support, multi-platform support, multiple controllers, and virtual reality avatars.

![Dance the macarena](../../assets/macarena.gif)

## Choosing a multiplayer package

There are a number of different approaches for building multiplayer games in Unity, some of the most common are:

- Mirror (Unity multiplayer networking) https://github.com/vis2k/Mirror
- Normcore (Unity multiplayer service) https://normcore.io
- Photon (Unity multiplayer service) https://www.photonengine.com/

Mirror is open source and fantastic for peer to peer multiplayer. It requires that you (or a player) host the server which requires more work at scale. If you are looking to use Mirror I highly recommend the excellent YouTube series [How To Make A Multiplayer Game In Unity - Client-Server - Mirror Networking](https://www.youtube.com/watch?v=5LhA4Tk_uvI&list=PLS6sInD7ThM1aUDj8lZrF4b4lpvejB2uB) by DapperDino.

Photon and Normcore are hosted services but both have free plans. Photon tends to charge based on the number of concurrently connected users and Normcore based on the hours spent in shared "rooms". I tend to use Normcore because the kinds of games I want to make work better with their plans and I find it the simplest solution. Depending on your use case you might choose another option.

Check out the pricing:

- https://normcore.io/pricing
- https://www.photonengine.com/en-US/PUN/Pricing

## Planning out the scene

Before we start building our scene it is important to outline our goals:

- Users should be able to view and control their player with a VR headset, Keyboard and AR
- Each player will be represented by an avatar within the game
- VR controllers can represent hands and teleport
- Avatars are rigged with inverse kinematics
- Networked objects should be sharable between players

### User control

Within our basic example we were able to control the player's view (what is displayed on the each lens) by moving the camera when the headset moved. In this way, the locomotion of our headset is our main "controller." But what about our friends that don't have an Oculus Quest? It would be great if they could also join our multiplayer game. To support this we will create three sets of controls:

- Virtual reality - the headset and the two VR controllers
- Augmented reality - using a phone as an AR controller
- Computer - using a keyboard and mouse to control the player

This adds some complexity but it means our game will be more accessible. Additionally, it makes it much easier to test out the multiplayer functionality (without needing multiple headsets). We can run the game in the Unity editor and our device to test various aspects of our game.

#### Avatars

Game designers often categorize their games as first-person or third-person. In a first-person game you view the game from the player's perspective. Games like Quake or Counter-strike (or Superhot for VR) are "first-person shooters." In a third-person game you control the player but not from the player's perspective. Games like Super Mario 3D World (or Moss for VR) let you control Mario without seeing through Mario's eyes. We'll probably end up using multiple perspectives, but we'll start with first-person as that will be more immersive in VR.

Regardless of the perspective, we'll need to be able to show the player in the scene. Often in first-person VR games you don't see yourself (you might see only your hands). Because our game is multiplayer we'll need to be able to see the other players in the scene. These are called player avatars[^avatar]; and they are what we'll be controlling.

[^avatar]: Why are they called "avatars"? According to [wikipedia](<https://en.wikipedia.org/wiki/Avatar_(computing)>), "The word avatar originates in Hinduism, where it stands for the 'descent' of a deity in a terrestrial form." It goes on to say, "The use of the term avatar for the on-screen representation of the user was coined in 1985 by Richard Garriott for the computer game Ultima IV: Quest of the Avatar. In this game, Garriott desired the player's character to be his earth self manifested into the virtual world."

When a player joins the multiplayer version of our game we'll create a local player avatar for them. As they control their character and move it around the scene, we'll update our local copy of the avatar. To do this we'll separate out how the player is controlled from how the player object is updated and displayed - even for our own local player object.

#### VR controllers can represent hands and teleport

In the previous post we were able to look around our scene - but we didn't have a body or even hands. The Oculus Quest offers two ways to control the hands of your character: hand tracking and touch controllers. We'll implement the touch controllers and use those as our "hands" within our scene. This will allow us to leverage haptic feedback and different button inputs for interacting.

Tracking the headset's position means that walking around in reality will translate to player movement in virtual reality. That's great, but a given player's play-space size might be very small. Because we'll be using the controllers, we could easily utilize the thumb-sticks to control player locomotion. Generally there are three kinds of controller based locomotion:

- Teleporting
- Snap-turns
- Thumbstick movement

We'll implement all three of these controls. Unfortunately, though, thumbstick based movement can induce discomfort as the player's visual position changes without a corresponding physical change. For this reason, many games do not enable thumbstick based movement, so we'll make it optional.

#### Rigged characters and inverse kinematics

Our VR avatars will be controlled using three 3D points: the headset and the two controllers. Using these three points we can easily represent a head and two hands in our scene. We can go further: rigging these to an entire body with arms will let us control all parts of the body like a puppeteer. This is done by solving how the joints would need to bend based on the three control points using a technique called inverse kinematics.

#### Networked objects should be sharable between players

Lastly, we'll want to be able to see (and share) objects in our multiplayer scene. For example, we'll want to be able to pickup, drop and throw things. For most objects within a multiplayer environment there is one "owner" that determines the position and rotation of each object. Changes to the position and rotation are broadcast to all of the participants. In most cases physics simulations are handled on the local machine of the "owner".

One thing we're not covering in this post is anti-cheating. Because we are relying on the clients to broadcast changes to the position of objects (including their own player) we are trusting them to follow the rules. A cheater could, in theory, modify the game so they could run or move more quickly, go through walls, etc. For now we won't worry about validating movements but in a public application you would need to implement a robust anti-cheating system.

# Create a new project

We'll need to create a new Unity project for our multiplayer scene. We'll assume you are starting with the project from the previous post. If you followed that post you can continue to use the same project you've already started.

## Getting started with Normcore

https://normcore.io/documentation/essentials/getting-started.html

Sign up for an account.

Download the package.

Open the package.

Import the package ![](https://rpl.cat/uploads/8E-WEWIob3jKUXnQKRYTW4FOYneniX3PZ-VAxP4yKEo/public.png)

Create a new Game Object called `Realtime`

Add a `Realtime` component and set the `App Key` (you may need to create an application first: https://normcore.io/dashboard/app/applications). For now you can leave the room as `Test Room`.

Add a `Realtime Avatar Manager` component.

![](https://rpl.cat/uploads/y0NhpxJbD243Msrpnw2V-dlHNxsNAib3QFOxx1-TLrk/public.png)

## Creating a Custom Avatar

https://normcore.io/documentation/guides/xr-avatars-and-voice-chat.html#creating-custom-avatars

Create a new empty game object and call it `Avatar`

Add a `Realtime Avatar` component to the object. Notice that it added a `Realtime View` automatically for you. This will help track and broadcast the position of this object across players. Click `Create Avatar Prefab`. This will add a `Realtime Transform` and three new child objects: `Head`, `Left Hand`, `Right Hand`. Each of these objects have `Realtime View` and `Realtime Transform` components and will be tracked accordingly. The `Head` object also has components for syncing the voice and changing the scale of the head proportionally.

We need to turn this into a prefab. Create a new folder in your `Assets` called `Resources` (it must be called `Resources` for the object to be instantiated at runtime). Drag the `Avatar` object into the `Resources` folder. Next, delete the object from the scene hierarchy.

Select the `Realtime` game object. Drag the `Avatar` prefab from the `Assets/Resources` into the `Local Avatar Prefab` property.

You should be able to run the game and all of the players that join will have their own avatar (made out of cubes).

## Keyboard controller

Adding the ability to control things with the keyboard will make it easier to test and debug the game. Also, it will make it easier to get multiple players in the game.

Add a new empty game object called `Keyboard` to the `Controller` game object. Then add a `Camera` object to the `Keyboard` object. Change the tag to `MainCamera`. Then add a `Simple Camera Controller` component to the `Camera` object:

![](https://rpl.cat/uploads/WCXLFh7UfDbevVn7uW7L3cyO6Ej0yAaDgBmh3N7x5T4/public.png)

You may want to adjust the sensitivity of the camera controller:

![](https://rpl.cat/uploads/cr1BKq8OC_cL4L5MesXjRaXYjTWzxBFPmBY6n_xfYrs/public.png)

Also, you can check the `Invert Y` checkbox.

Uncheck the `Keyboard` object in the hierarchy so that it is not active when the game starts.

![](https://rpl.cat/uploads/wQhwTBTNLfzgoitMiN77MymW-XFiajz5osWJ1bcu2cM/public.png)

We now have two controllers in the scene: the keyboard and the XR rig. We'll want to make it so that the game auto-switches to the keyboard controller when the XR rig is not available. In the `Controller` object create a new script called `ControllerSwitcher`.

```cs
#if !(UNITY_EDITOR_WIN || UNITY_STANDALONE_WIN || (UNITY_ANDROID && !UNITY_EDITOR))
#define OVRPLUGIN_UNSUPPORTED_PLATFORM
#endif

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Normal.Realtime;

public class ControllerSwitcher : MonoBehaviour
{
  public GameObject keyboardController;
  public Transform keyboardHead;
  public GameObject XRRig;
  public Transform XRHead;
  public Transform XRLeftHand;
  public Transform XRRightHand;
  public Transform realtime;

  private RealtimeAvatarManager realtimeAvatarManager;

  void Start()
  {
    realtimeAvatarManager = realtime.GetComponent<RealtimeAvatarManager>();
    realtimeAvatarManager.avatarCreated += OnAvatarCreated;

#if OVRPLUGIN_UNSUPPORTED_PLATFORM
    XRRig.SetActive(false);
    keyboardController.SetActive(true);
#else
    XRRig.SetActive(true);
#endif
  }

  void Update()
  {
  }

  public void OnAvatarCreated(RealtimeAvatarManager avatarManager, RealtimeAvatar avatar, bool isLocalAvatar)
  {
    if (!isLocalAvatar) return;

#if OVRPLUGIN_UNSUPPORTED_PLATFORM
    avatar.localPlayer.head = keyboardHead;
#else
    avatar.localPlayer.root = XRRig.transform;
    avatar.localPlayer.head = XRHead;
    avatar.localPlayer.leftHand = XRLeftHand;
    avatar.localPlayer.rightHand = XRRightHand;
#endif
  }
}
```

![](https://rpl.cat/uploads/ESJ4FZWK6_k8ZgadmInOKwa5uCp4EJiflqUpSB7mEuQ/public.png)

If you are running on a Mac M1, you may encounter an error when Normcore attempts to connect to your Microphone. To fix this, you can try the following: open the Avatar prefab (double-click), open the `Head` object and uncheck the `Realtime Avatar Voice` component. This completely disables voices, but will allow the game to run without crashing.

You'll notice that you head moves with the keyboard controller, but your hands are stuck in the ground. We'll need to fix this later when we setup our inverse kinematics.

## Locomotion

Now that we have bodies and hands we can start implementing the locomotion controls. In the scene hierarchy, add a new `Locomotion System (Action Based)`. By default this will give you a `Locomotion System` component, a `Teleportation Provider` component, and a `Snap Turn Provider` component. Connect the `XR Rig` to the `XR Rig` property. This should allow you to snap turn using the thumbsticks.

![](https://rpl.cat/uploads/F-MA3KQHMu9u8zfHDMHXePCOzPAwtMIdgGXnxXB8eXs/public.png)

## Teleporting around

Let's make it so you can teleport around. In order to teleport, we'll need to have a place we can teleport to. Click on the `Floor` object in the `Environment` object. Add a `Teleportation Area` component:

![](https://rpl.cat/uploads/9V7Kjcgjzywt09UGC7Qa6s2djdGwpFsIXFAvMPnjKpc/public.png)

Run the game. You should be able to use the grip buttons to teleport.

This is pretty simple teleportation. Let's improve it by using the thumbsticks to teleport instead. We'll also add a "reticle" that allows us to see where we're going.

### Reticles

We'll make a basic reticle. Create a new Cylinder in the environment and name it `Reticle`. Remove the collider, reset the transform and scale the X and Z down to 0.6 and scale the Y down to 0.1:

![](https://rpl.cat/uploads/EsTVD4jdyH1-YjSq34LruleKPK4Bbgjez4fAp6TxGZ8/public.png)

Make a new material for the reticle and call it `Reticle`. Set the base color to blue, the opactity to 0.5, change the `Surface Type` to `Transparent`:

![](https://rpl.cat/uploads/n3QtnCVCF4X79u1kl6J4C15X7K44xFuLGCTPAxKeJ6k/public.png)

Drag the material onto the `Reticle` object.

Within the `RightHand Controller` object, change the `XR Ray Interactor`'s `Line Type` to `Projectile Curve` and change the `Velocity` to `8`. Set the `Select Action Trigger` property to `State Change`. Uncheck `Enable Interaction with UI GameObjects` and set the `Haptic Events` as follows:

- `On Select Enter`: Haptic Intensity: `0.3`, Duration: `0.1`
- `On Hover Enter`: Haptic Intensity: `0.1`, Duration: `0.1`

![](https://rpl.cat/uploads/FD-REpbi7XqXpL2g2poM0Hr-7N-y0YBfl4hOBD6lN4s/public.png)

Then drag the `Reticle` object from the hierarchy to the `XR Interactor Line Visual`'s `Reticle` property:

![](https://rpl.cat/uploads/k8VyJ7cw26eXvwI4d7v6WbexU-G5ztdT8En7LHUqbrM/public.png)

https://www.youtube.com/watch?v=siFRhXNVIcY

## Adding a ball to throw

Create a new sphere object.

![](https://rpl.cat/uploads/MisQlp5KkPmYXRpcDgRhkrGGcJAlM7_Fo5evyGf0-yE/public.png)

Position it above the table. You can set the transform as follows:

![](https://rpl.cat/uploads/sLSuKU8M7daKXkezRlnes-KlExQFpHbaBRifqxSNKRo/public.png)

Add a RigidBody to the sphere and add an `XR Grab Interactable`. Set the `XR Grab Interactable` movement type to `Velocity Tracking` and check the `Force Gravity on Detach` checkbox. At this point you should be able to run the game and grab the sphere. You can even throw it! Unfortunately you'll find it hard to get any momentum from the throw. Run the game and try to throw the sphere.

The reason you can't throw it well is because the ball is colliding with your hands. When you let go of the grip button, the ball will start to collide and immediately fall down. If you don't want interactors to work with it change the Layer of the ball to a new layer called `Grab`.

![](https://rpl.cat/uploads/KnkPfTbU3gOzTVukP-gE68L_5PxBF_KkfD0-X4A4nKQ/public.png)

We'll also create a new layer called `Avatar`. Open the `Avatar` prefab and change the layer of the `Avatar` object to `Avatar` (including all of the children).

![](https://rpl.cat/uploads/afw9XuGnV_BYh5Hh5fIYLX-qtXxeTKw3yYkAUkIJeiI/public.png)

Go to `Edit` | `Project Settings` | `Physics` and go to the Layer Collision Matrix. Uncheck the box that is the intersection between `Avatar` and `Grab`.

![](https://rpl.cat/uploads/FlrMZIhG-X00H6wYCrtXjardpPL3dSM2_qcVoIj2aUE/public.png)

Unfortunately the ball is not shared between all of the players. Each player sees the ball only for themselves.

To fix this we'll need to add a `Realtime Transform` component to the ball. This will automatically add a `Realtime View` component to it as well. In order manage the ownership of these objects we'll need each player to request ownership of the ball when it is grabbed. Create a new script component on the ball called `Grabbable`. Use the following code:

```cs
using Normal.Realtime;
using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;

public class Grabbable : MonoBehaviour
{
  private RealtimeTransform realtimeTransform;
  private XRGrabInteractable interactable;

  void Awake()
  {
    realtimeTransform = GetComponent<RealtimeTransform>();
  }

  void Update()
  {
    // Check to see if we think we're holding it, but no longer the owner of it.
    if (interactable.isSelected && !realtimeTransform.isOwnedLocallySelf)
    {
      // Drop it like it's hot!
      interactable.interactionManager.CancelInteractableSelection(interactable);
    }
  }

  protected void OnEnable()
  {
    interactable = GetComponent<XRGrabInteractable>();
    if (interactable != null)
    {
      interactable.selectEntered.AddListener(OnSelectEntered);
    }
  }

  protected void OnDisable()
  {
    if (interactable != null)
    {
      interactable.selectEntered.RemoveListener(OnSelectEntered);
    }
  }

  public void OnSelectEntered(SelectEnterEventArgs args)
  {
    // Once we grab it, we're the owner of it - this will force everyone else to drop it.
    realtimeTransform.RequestOwnership();
  }

}
```

### Ownership, physics, and gravity

It might feel like we are doing a lot of work to figure out the "ownership" of the ball. An object can only have one owner at a time. The owner is responsible for the physics and gravity of the object. If you don't own the ball, you can't move it. This tends to be a problem when you have multiple players trying to grab the ball.

A common bug happens when one player is holding the ball and another grabs it out of their hand. According to the `XRGrabInteractable` both players think they are holding the ball and controlling the movement. This results in the ball's position being out of sync. When the player releases the ball, the ball should fall down, but instead loses its gravity because no owner is simulating its physics.

The above code fixes this by repeatedly checking if the ball is owned by the player during `Update`. If it is not owned by the player but is being "held" according the `XRGrabInteractable` then the ball should be immediately dropped.

> For more information, see https://www.youtube.com/watch?v=j2ldiEUxegs (but note that we are accomplishing a lot of the tasks differently).

## Shooting a gun

Add a new empty game object called `Gun`. Reset the transform. Add a `RigidBody` component and an `XR Grab Interactable` component to the `Gun`. Set the `XR Grab Interactable` movement type to `Velocity Tracking` and check the `Force Gravity on Detach` checkbox. We'll also want to add the `Grabbable` script from earlier to the `Gun`.

Add two child cubes. Make the first cube scale x: 0.1, y: 0.2, z: 0.1

![](https://rpl.cat/uploads/mI_OgLcqVXXuJSj_mbenY3Ni5bqnytQiN29ka2mTc14/public.png)

Make the cube scale x: 0.1, y: 0.1, z: 0.4 and position: x: 0, y: 0.1, z: 0.15.

![](https://rpl.cat/uploads/laLPiKogTP1uV9qaaCoQ3OPLMrIbTZt7lGTwXO6rJT0/public.png)

Add another empty game object called `Fire point` as a child of the `Gun` object. Reset the transform. Set the position to x: 0, y: 0.1, z: 0.5.

### Making the gun shoot

Add a new script component to the `Gun` object called `Fire` with the code:

```cs
using Normal.Realtime;
using UnityEngine;

public class Fire : MonoBehaviour
{
  public Transform firePoint;
  public string bulletPrefab;
  public float firePower = 1000f;

  public void FireBullet()
  {
    GameObject bullet = Realtime.Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
    bullet.GetComponent<Rigidbody>().AddForce(firePoint.forward * firePower);
  }
}
```

Notice that we are instantiating the bullet by name, not by reference. Additionally, we are using the `Realtime` instance to control the instantiation. This is because we want to make sure that the bullet is instantiated on all of the clients even though it is owned by the player who is shooting it. The player who is shooting the bullet will be in charge of simulating the physics (including gravity) of the bullet. Because of this, the controlling player can immediately add force to the bullet.

In Unity, drag the `Fire Point` object onto the `Fire Point` field in the `Fire` script component. Set the `Bullet Prefab` field to `Bullet`:

![](https://rpl.cat/uploads/KIg9jmE8aUR_I--FpQF3LAMiDLBn1Srgu1-U2QEpa0I/public.png)

On the `Gun` object, create a new `Activate` event on the `XR Grab Interactable` component. Drag the `Fire` script component onto the `Activate` field. Then set the method to `Fire.FireBullet`.

![](https://rpl.cat/uploads/xaZrk0X21chzE-MqfM_qaSaq0ZbJ-aM37QjK0MT1-IY/public.png)

Move the gun above the table and then duplicate it so that there is one for you and your friend.

> You may have noticed that you can't throw the gun, just like the ball. This is because the gun is colliding with your hands. Select both of the `Gun` objects and change the layer to `Grab`. Apply this to all of the children of the `Gun` objects as well.
>
> ![](https://rpl.cat/uploads/ZYY0t6zTizMk6u92KI6Rn-7_Vai7K7V4kIUI-_nAuVY/public.png)

Lastly, we'll need to create the prefab for the bullets. Add a new Sphere to the scene and call it `Bullet`. Set the position to x: 0, y: 0, z: 0 and the scale to x: 0.1, y: 0.1, z: 0.1. Add a `Realtime Transform` component so that all players can see it. Add a `RigidBody` component then drag it into the `Resources` folder to create a prefab and then delete it from the scene.

> For more information, see https://www.youtube.com/watch?v=44SEReNPSx4, (but note that we are accomplishing a lot of the tasks differently).

### Destroying the bullets

When we shoot the bullet, we'll want to destroy it after a certain amount of time. Open the `Bullet` prefab and create a new script component called `Destruct` with the following code:

```cs
using Normal.Realtime;
using System.Collections;
using UnityEngine;

public class Destruct : MonoBehaviour
{
  public void Awake()
  {
    StartCoroutine(SelfDestruct());
  }

  IEnumerator SelfDestruct()
  {
    yield return new WaitForSeconds(5f);
    Realtime.Destroy(gameObject);
  }
}
```

This will automatically destroy the bullet after 5 seconds.

# Something fun: adding some color

Duplicate one of the guns so you have three guns. You need to do this because your game is so cool now you'll probably have another friend wanting to play with you.

Create three new materials. Name them `Yellow`, `Green`, and `Blue`. Set the `Yellow` material to yellow, `Green` to green, and `Purple` to purple.

![](https://rpl.cat/uploads/D6L0kkOGCTyYMgP7hzwBjApuLe_drdw-ptXCMNhrVUA/public.png)

Drag those onto the guns.

![](https://rpl.cat/uploads/f_m9QfY_ldvBUZQtRTbIC6LnINVYR9DGCZY_x80usmI/public.png)

Let's also make the bullets white. Make another material called `White` and set it to white:

![](https://rpl.cat/uploads/2jwJtwUN5olocfnvuDpSswylMOr37KDhTDtc0TWJk1Y/public.png)

Open the `Bullet` prefab and drag the white material onto it.

# Player names

Now that we have so many players it would be nice to have a way to name them. We can do this by adding a UI text component above the player's head. Open the `Avatar` prefab and add a new `UI`, `Text - TextMesh Pro` component called `Player Name`. When you add this, it will ask if you want to import `TMP Essentials`. Click the button to import them - for now we won't need the `TMP Examples & Extras`:

![](https://rpl.cat/uploads/1mXW8lkzIxgWFxGaQtzgKE0FOE4kLw651V9X5e1kCW4/public.png)

Unity automatically created a `Canvas` object as well. Unfortunately, it's gigantic. Let's make it smaller. Open the `Canvas` object, and set the `Render Mode` to `World Space`.

Then reset the transform, and set the scale to `Pos X`: 0, `Pos Y`: 0.3, `Pos Z`: 0. Set the `Width`: 1 and the `Height`: 1.

![](https://rpl.cat/uploads/1xQMSZu4jUYdxtxBzF8mOp0hQd4VtR8kwMW4mzD8Di8/public.png)

Select the actual TextMeshPro component and set the `Text` to `Player Name`. Then reset the transform, and set the scale to `Pos X`: 0, `Pos Y`: 0, `Pos Z`: 0. Set the `Width`: 1 and the `Height`: 1. Set the `Y` rotation to `180`. Set the `Font Size` to 0.1. Lastly, set the `Alignment` to center and the vertical alignment to middle:

![](https://rpl.cat/uploads/OGClX1pw2MlHUFtS7IY5H7kfQEWJFGc4D6wFUv1D6RI/public.png)

## Multiplayer names

If you run the game, everyone will have the same name: `Player Name`. Let's change that. In order for everyone to see each player's name, we'll need to sync the player attributes through Normcore.

Create a new script called `AvatarAttributesModel.cs` with the following code:

```cs
using Normal.Realtime;
using Normal.Realtime.Serialization;

[RealtimeModel]
public partial class AvatarAttributesModel
{
  [RealtimeProperty(1, true, true)]
  private string _nickname;
}
```

This model has a single synchronized property called `_nickname`. We've indicated that the property should be `reliable` meaning that it is guaranteed to be sent to all clients (it won't be lost due to packets not being delivered). We've also indicated we want an on-change callback for this property.

Return to Unity and let the script compile. Then click on the script in the assets folder:

![](https://rpl.cat/uploads/eJrBL7EmLQ8LMGxoSVeiJ7kmdLaGAd1ygoaoMN2xqfg/public.png)

Click `Compile Model`. This will auto-generate most of the code we'll need to record the model properties. We'll also need to handle the changes to this model. To do this, we'll create a corresponding sync class. Create a new script called `AvatarAttributesSync.cs` with the following code:

```cs
using Normal.Realtime;
using TMPro;

public class AvatarAttributesSync : RealtimeComponent<AvatarAttributesModel>
{
  public TextMeshProUGUI playerNameText;

  private string playerName;

  private static string[] adjectives = new string[] { "Magical", "Cool", "Nice", "Funny", "Fancy", "Glorious", "Weird", "Awesome" };

  private static string[] nouns = new string[] { "Weirdo", "Guy", "Santa Claus", "Dude", "Mr. Nice Guy", "Dumbo" };

  private bool _isSelf;

  public string Nickname => model.nickname;

  private void Start()
  {
    if (GetComponent<RealtimeAvatar>().isOwnedLocallyInHierarchy)
    {
      _isSelf = true;

      // Generate a funny random name
      playerName = adjectives[UnityEngine.Random.Range(0, adjectives.Length)] + " " + nouns[UnityEngine.Random.Range(0, nouns.Length)];

      // Assign the nickname to the model which will automatically be sent to the server and broadcast to other clients
      model.nickname = playerName;

      // We don't need to see our own nickname
      playerNameText.enabled = false;
    }
  }

  protected override void OnRealtimeModelReplaced(AvatarAttributesModel previousModel, AvatarAttributesModel currentModel)
  {
    if (previousModel != null)
    {
      // Unregister from events
      previousModel.nicknameDidChange -= NicknameDidChange;
    }

    if (currentModel != null)
    {
      if (currentModel.isFreshModel)
      {
        currentModel.nickname = "";
      }

      UpdatePlayerName();

      currentModel.nicknameDidChange += NicknameDidChange;
    }
  }

  private void NicknameDidChange(AvatarAttributesModel model, string nickname)
  {
    UpdatePlayerName();
  }

  private void UpdatePlayerName()
  {
    // Update the UI
    playerNameText.text = model.nickname;
  }
}
```

There is a lot going on in this script, but it is mostly boilerplate change handlers. The most interesting thing is that we are generating random funny names for the players and syncing them to everyone.

Back in Unity, open the Avatar prefab. Add the `AvatarAttributesSync` script to the `Avatar` object. Then drag the `Player Name` TextMeshPro component to the `Player Name Text` field:

![](https://rpl.cat/uploads/uaZCpuzMSk4QaH1lv_AXIASohBNZMzS9iU_7TC0YaFE/public.png)

# Inverse kinematics

Right now, our head and hands are just cubes. We don't even have a body. We could add a body, and attach our hands to the character hands and the head to the character head, but when we move our hands and heads the body will just deform. Instead, we'll use the `Inverse Kinematics` feature to make our avatar's head and hands look like they are attached to the body and let the body solve the natural position automatically.

We'll need a good looking body. Go to the Unity Asset Store and get the free [POLYGON Starter Pack - Low Poly 3D Art by Synty](https://assetstore.unity.com/packages/3d/props/polygon-starter-pack-low-poly-3d-art-by-synty-156819)[^synty].

Back in Unity, open the `Package Manager` and switch to `My Assets`:

![](https://rpl.cat/uploads/8hm5kOtxB_ae4DXMH_XAOcE2hU1uXI8TWE9jpVuJhUo/public.png)

Then search for the `POLYGON Starter Pack - Low Poly 3D Art by Synty` package:

![](https://rpl.cat/uploads/T1uuMGvOgXH4rRtLY-iMQIdgiuI7YcRvRSI3WkQoz1o/public.png)

[^synty]: Why are we using the `Polygon Starter Pack`? Because it has a nice low poly body, and it's free. But more importantly the Synty assets are amazing for virtual reality. They have a large number of packages available from their store: https://syntystore.com/

Click `Download`. Then click `Import`:

![](https://rpl.cat/uploads/h8XuYopink_A6P5iDLreVdOZQh0tcbOceQ_NAG44Knk/public.png)

Import the entire package.

Once installed, you can look at the imported assets. You may notice that all of the materials and prefabs in the `Assets/PolygonStarterPack` folder are pink:

![](https://rpl.cat/uploads/th2fHBMfRRU2xe2Mtxs137I8gqdNVSnr1nWdbQGp-Tg/public.png)

This is because we are using the Universal Render Pipeline but the assets were prepared without that pipeline. Open the `Edit` menu, then `Render Pipeline`, `Universal Render Pipeline`, then click `Upgrade Project Materials to UniversalRP Materials`. This will upgrade all of the materials in the `Assets/PolygonStarterPack` folder to use the Universal Render Pipeline:

![](https://rpl.cat/uploads/qxsa4HSMgir374frzHsuAkKPeKFT6H4ywpL_YeqyA1w/public.png)

Click `Proceed` to continue. Within the Assets preview some of the assets may still appear pink, but when you use them in the scene they will be the correct color.

This is a good point to save your work.

## Add a character to the scene

Let's add a character to the scene. Find the `SM_Character_Male_01` prefab asset and drag it into the scene. Reset the transform and rename `SM_Character_Male_01` to `Character`. Right click the object in the hierarchy and in the `Prefab` menu, click `Unpack completely`.

Hold option and click the arrow next to it to fully expand all of the children.

![](https://rpl.cat/uploads/393kf_6_2kq7cCKnOcFkAt0AxQMF_KQDSi8TdzodfaI/public.png)

Notice that the character comes with the geometry of both the Male and Female character, we'll use this later:

![](https://rpl.cat/uploads/tNqcUcJBr_VI7kBootT7sFei8xyCDp_jFAzGk1OG3hA/public.png)

Now that we have a character, re-open the Package Manager, and change the filter to `Unity Registry`. Search for the `Animation Rigging` package:

![](https://rpl.cat/uploads/ba_7xECxdsehcvUh3ltO9pMz3mVjJKLJcwu_aW21YBU/public.png)

Click `Install`. This will give us a set of useful tools for rigging our character.

## Rigging the upper body

Select the `Character` game object then, in the `Animation Rigging` menu, click `Bone Renderer Setup`. Now you should see the bones in the scene:

![](https://rpl.cat/uploads/E1G3CmyHqJxBpVkFJ6HXcyEZJxDqVaJHh3RZl5fHN3o/public.png)

With the `Character` still selected, go to the `Animation Rigging` menu again and click `Rig Setup`. This will create a child rig named `Rig 1`. Rename the newly created rig to `Upper Body`.

We'll need to create "constraints" our hands and head. Add an empty object called `IK_Hand_R` and add a `Two Bone IK Constraint` component to it.

> We'll be selecting and dragging several objects at a time which can get confusing. To simplify this we'll lock the inspector to the current object (`IK_Hand_R`)
>
> ![](https://rpl.cat/uploads/gNoxqLkFUjupNTij7ioRs_QQaA_lPVyoth3ZuGTbYEo/public.png)

Lock the inspector, then click on the right hand in the scene and drag it to the `IK_Hand_R` object `Tip` property. This is the far end of our constraint. Right click on the `Two Bone IK Constraint` component title and click `Auto Setup from Tip Transform`:

![](https://rpl.cat/uploads/1H80M-3FR77F4mwpaQAW9sjhe07QT0oygOJqyEg8-Ak/public.png)

This will create a target called `IK_Hand_R_target` and a _hint_[^hint] called `IK_Hand_R_hint`. We'll need to align the target and the to the hand. Select the `IK_Hand_R_target` in the hierarchy and then select the `Hand_R` object simultaneously[^multiselect] (the `Hand_R` is nested inside the `Root` object, but you can jump to it quickly by command clicking on the property value in the inspector). In the `Animation Rigging` menu, click `Align Transform`.

[^hint]: When working with inverse kinematics, the "hint" is used to help the solver find the correct position of the target. The "target" is the end of the constraint. The solver can bend the bones at the joint in any number of ways when trying to solve the position, but uses the hint to help it know how to bend the bones at the joint.
[^multiselect]: Selecting multiple objects in Unity is a bit tricky. You can select multiple objects by holding down the command key on Mac or the control key on Windows and clicking each of the objects in the hierarchy. Note: the order that you select the objects matters.

We'll also need to align the hint to the elbow. Select the `IK_Hand_R_hint` and the `Elbow_R` object (used for the `Mid` property) and again click `Align Transform` in the `Animation Rigging` menu. Unlock the inspector.

Human elbows tend to bend in very specific angles. Because of this, we'll want to move the hint slightly behind the elbow. Select the `IK_Hand_R_hint` and move it back. This will vary for each humanoid model, but in our case we'll set the position to: `X`: 0.8, `Y`: 0.06, `Z`: -0.5.

We'll need to repeat this process for the left hand. The only difference is the the `IK_Hand_L_hint` position is reversed: `X`: -0.8, `Y`: 0.06, `Z`: -0.5.

With the hands aligned, we can now create a "constraint" for the head. Add an empty object called `IK_Head` and add a `Multi-Parent Constraint` to it. Drag the `Head` object from the `Root` to the `IK_Head` object `Constrained Object` property. Lock the inspector again.

There isn't a way to automatically generate a target for this constraint. Instead, create a new child empty object called `IK_Head_target`. Select it, then simultaneously select the `Head` object (under the root). In the `Animation Rigging` menu, click `Align Transform`. Unlock the inspector.

Finally, drag the `IK_Head_target` to the `Source Objects` property of the `IK_Head` object.

## Attaching the character to the avatar

At this point we have a rigged character with all of the bones we need and all of the inverse kinematics and constraints we need to move the bones correctly. Next, we'll need to connect the character to the avatar so that there is a character controlled by every player that joins the game. To do this we'll move what we've built into the `Avatar` prefab.

- Right click the `Character` object and choose `Copy`
- Open the `Avatar` prefab from the `Resources` folder; right click the `Avatar` object and choose `Paste`
- Close the `Avatar` prefab and delete the `Character` object from the scene (but not from the prefab)

Save the scene.

Even though each `Avatar` has a `Character`, it will not follow the movement of the controllers yet. Open the `Avatar` prefab again. On the `Character` object, create a new script called `Follow` with the following code:

```cs
using UnityEngine;

[System.Serializable]
public class FollowOffset
{
  public Transform follow;
  public Transform target;
  public Vector3 position;
  public Vector3 rotation;

  public void Update()
  {
    target.position = follow.TransformPoint(position);
    target.rotation = follow.rotation * Quaternion.Euler(rotation);
  }
}

public class Follow : MonoBehaviour
{
  public FollowOffset head;
  public FollowOffset leftHand;
  public FollowOffset rightHand;

  public Transform headConstraint;
  public Vector3 headBodyOffset;

  void Update()
  {
    transform.forward = Vector3.ProjectOnPlane(headConstraint.forward, Vector3.up).normalized;
    transform.position = headConstraint.position + headBodyOffset;

    head.Update();
    leftHand.Update();
    rightHand.Update();
  }
}
```

The `Follow` script has three main properties:

- Head
- Left Hand
- Right Hand

Each of these has a _target_ which is the constraint that will be used to move the bone and a _follow_ object that we want the track - in our case the `Head`, `Left Hand` and `Right Hand` objects of our `Avatar`. Save the script and return to Unity. Connect all of the `Follow` and `Target` properties:

![](https://rpl.cat/uploads/DViooK3-Nh3lwAQjj-LuAhfU0sfFIaQoEEHGcKIX-qM/public.png)

Notice that we've setup a number of offsets for each of the tracked objects. These will vary for each model you use. The reason you need to have an offset is that all of our alignments are based off of the bones themselves. If we didn't have an offset, then the hand would be aligned to the center of the joint where the hand meets the forearm bone. This might be right, but for many models (espcially those with large chunky hands) that point looks and feels wrong. Adjusting the offset so it is aligned with the palm of the hand feels more natural when playing.

Similarly, the center of the head is almost never aligned with the eye-line. Adjusting the head position to align with the eye-line feels more natural when playing.

Lastly, we want to move the avatar slightly behind the where the headset is (`-0.65`). We do this for a couple of reasons:

- We don't want to see the avatar in front of the camera.
- Moving the headset forward helps the inverse kinematics solver account for the shape of the body.

Depending on the shape and size of your avatar you might want to adjust this value.

## Legs

At this point we haven't done anything with the legs. There are some additional tutorials below on how to do this. For now we'll simply hide the legs. To do this, open the `Root` node and find the `UpperLeg_L` and `UpperLeg_R` objects and change the scale to `0, 0, 0`:

![](https://rpl.cat/uploads/BsxDUAinC_35ABVQjqNQuZhuFgsAeF71ttlTeFss2bg/public.png)

### Physics and animations

One thing we should note is that the `Follow` script is performing instantaneous updates. There are several other models for tracking positions and rotations including physics and animation.

If you are looking to include more animations (for example, running, walking, and idling) you might want to explore the following videos from Valem:

- Inverse Kinematics - Part 1 - https://www.youtube.com/watch?v=tBYl-aSxUe0&list=RDCMUCPJlesN59MzHPPCp0Lg8sLw&index=1
- Inverse Kinematics - Part 2 - https://www.youtube.com/watch?v=Wk2_MtYSPaM&list=RDCMUCPJlesN59MzHPPCp0Lg8sLw&index=2
- Inverse Kinematics - Part 3 - https://www.youtube.com/watch?v=8REDoRu7Tsw&list=RDCMUCPJlesN59MzHPPCp0Lg8sLw&index=3

If you are looking to have your character's hands interact with the world based on physics, you might want to explore the following videos from Justin P. Barnett:

- Inverse Kinematics in Virtual Reality | VR Upper Body IK Unity Tutorial - https://www.youtube.com/watch?v=MYOjQICbd8I
- Inverse Kinematics in Virtual Reality | VR Lower Body IK Unity Tutorial - https://www.youtube.com/watch?v=1Xr3jB8ik1g

In both cases, you'll find the approaches very similar.

## Hiding our placeholder avatar cubes

Throughout this process we've left the gray cubes we originally used for our avatar visible. These can be really helpful when trying to adjust the offsets of the hands and head. Build and run the game on the headset, then join the game within Unity. Looking at the alignment of the cubes and hands you can quickly figure out how to adjust the offsets.

Once you're satisfied with the offsets, you can hide the cubes by going to the `Avatar` prefab going to each of the `Geometry` objects and unchecking the main checkbox:

![](https://rpl.cat/uploads/fCCEfQ4lAKqf1AIZw93p-ieSSMb2CaY5CQ-NSHAaLgs/public.png)

# All done

With this we should be able to make a fun game. Or just dance:

![Dance the macarena](../../assets/macarena.gif)

## Future directions

Some additional things we could explore:

- Animating the legs
- Interacting with physics
- Switching the body
- Hiding your own head
- Scaling for different body sizes
- Ghost mode
