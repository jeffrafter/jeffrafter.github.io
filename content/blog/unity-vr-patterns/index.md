---
title: Unity VR Patterns
date: '2021-01-16T00:01:00'
published: false
slug: unity-vr-patterns
comments: https://github.com/jeffrafter/jeffrafter.github.io/issues/19
image: ../../assets/oculus-quest-2.jpg
layout: post
tags: ['oculus', 'quest', 'unity', 'development', 'vr', 'virtual-reality']
category: development
excerpt: Unity VR Patterns
---

<figure class="fullwidth">
![Oculus Quest with Controllers](../../assets/oculus-quest-2.jpg)
</figure>
<figcaption class="fullwidth">
Image credit: <a href="https://oculus.com">Oculus Quest</a>
</figcaption>

## Keys

Duplicate: ctrl+d

## Importing assets and fixing the materials

## Adding input via a script

> From https://www.youtube.com/watch?v=u6Rlr2021vw

Go to the controller you want to add the action to and add a new script called `TestActionController`

```
// Add at the top:
using UnityEngine.XR.Interaction.Toolkit
```

Add this code:

```
// Add in the class
private ActionBasedController controller;

void Start() {
  controller = GetComponent<ActionBasedController>();
  controller.selectAction.action.performed += Action_performed;
}

void Update() {
  // You can check inside of update
  bool isPressed = controller.selectAction.action.ReadValue<bool>();
  Debug.Log("Select is pressed in update")
}

private void Action_performed(UnityEngine.InputSystem.InputAction.CallbackContext obj) {
  // throw new System.NotImplementedException();
  Debug.Log("Select button is pressed");
}
```

## Add a ball

From https://www.youtube.com/watch?v=gGYtahQjmWQ

1. Create a new sphere object.
2. Add a RigidBody to the sphere.
3. Add an `XR Grab Interactable`
4. Add an `XR Direct Interactor` onto both controller objects
5. Add a Sphere Collider onto both controllers

- set the `Radius` to `0.2`
- check the `Is Trigger` checkbox

6. Change the XR Rig Main Camera clipping planes `Near` to `0.1`

If you don't want interactors to work with it change the Layer of the ball to a new layer called `Grab`. Then go to the ray interactor and change the `Raycast Mask` from `Everything` to exclude the `Grab` layer.

Create a new layer called `Player` and set the `XR Rig` (and children) to this layer.

Go to `Edit` | `Project Settings` | `Physics` and go to the Layer Collision Matrix. Uncheck the box that is the intersection between `Body` and `Grab`.

## Teleportation

Valem: https://www.youtube.com/watch?v=fZXKGJYri1Y

Or

Justin P. Barnett: https://youtu.be/F4gDjCLYX88?t=1200

Change the ray interactor's `Select Action Trigger` to `State` (not `State Change`).

Change the Line Type to `Projectile Curve` and `Velocity` to `8`.

Uncheck `Enable Interaction with UI`

Haptics:

- `Play Haptics On Select Enter`: `0.3`, `0.1`
- `Play Haptics On Hover Enter`: `0.1`, `0.1`

You can add a `Reticle` to the `XR Interactor Line Visual`.

Create a cylinder, remove the collider, scale it down to 0.6 and scale the Y down.

## Continuous movement

https://www.youtube.com/watch?v=5NRTT8Tbmoc

- Add a `Character Controller` component to the XR Rig.
  - Set the Radius to `0.15`
  - Set the Center to `0`, `1`, `0`

Create a new script called `ContinuousMovement` on the controller

```
using UnityEngine.XR;
using UnityEngine.XR.Interaction.Toolkit;

public XRNode inputSource; // Set this to left hand
public float speed = 1;
public float gravity = -9.81f;
public LayerMask groundLayer;
public float additionalHeight = 0.2f;

private float fallingSpeed;
private XRRig rig;
private Vector2 inputAxis;
private CharacterController character;

void Start() {
  character  = GetComponent<CharacterController>();
  rig = GetComponent<XRRig>();
}

void Update() {
  InputDevice device = InputDevice.GetDeviceAtXRNode(inputSource);
  device.TryGetFeatureValue(CommonUsages.primary2DAxis, out inputAxis);
}

void FixedUpdate() {
  CapsuleFollowHeadset();

  Quaternion headYaw = Quaternion.Euler(0, rig.cameraGameObject.transform.eulerAngles.y, 0);
  Vector3 direction = headYaw * new Vector3(inputAxis.x, 0, inputAxis.y);

  character.Move(direction * Time.fixedDeltaTime * speed);

  bool isGrounded = CheckIfGrounded();
  if (isGrounded) {
    fallingSpeed = 0;
  } else {
    fallingSpeed += gravity * Time.fixedDeltaTime;
    character.Move(Vector3.up * fallingSpeed * Time.fixedDeltaTime);
  }
}

void CapsuleFollowHeadset() {
  character.height = rig.cameraInRigSpaceHeight + additionalHeight;
  Vector3 capsuleCenter = transform.InverseTransformPoint(rig.cameraGameObject.transform.position);
  character.center = new Vector3(capsuleCenter.x, character.height / 2 + character.skinWidth, capsuleCenter.z);
}

bool CheckIfGrounded() {
  Vector3 rayStart = transform.TransformPoint(character.center);
  float rayLength = character.center.y + 0.01f;
  bool hasHit = Physics.SphereCast(rayStart, character.radius, Vector3.down, out RaycastHit hitInfo, rayLength, groundLayer);
  return hasHit;
}
```

Is it Jittery?

- Edit | Project Settings | Time | set the `Fixed Timestep` to `1/90`

Add a `Snap Turn Provider` component to the `XR Rig`

- Set the `Turn Input Source` to `Primary 2D Axis`
- Add a controller and set it to `Right Hand`
- Reduce the `Activation Timeout` to `0.2`

## More advanced grabbing

From here: https://www.youtube.com/watch?v=FMu7hKUX3Oo

If you put the colliders on a child-object (not the object with the XR Grab Interactable) then you should link the XR Grab Interactable colliders with those.

For attach transforms: create a new empty child object called "Pivot". When adjusting make sure you've set to `Pivot` and not `Center`

![](https://rpl.cat/uploads/LGPIQEw8wvd9sNi1fv7s6uBrhQeSQEf-nOkEXd3K_uE/public.png)

- Blue axis is forward
- Green axis is controller handle

Move the pivot to the center of the handle. Then drag the Pivot object to the `Attach Transform` property of the `XR Grab Interactable` component.

## Fire a gun

```
using UnityEngine;

public class Gun : MonoBehaviour {

  public float speed = 40;
  public GameObject bullet;
  public Transform barrel;
  public AudioSource audioSource;
  public AudioClip audioClip;

  public void Fire() {
    GameObject spawnedBullet = Instantiate(bullet, barrel.position, barrel.rotation);
    RigidBody rb = spawnedBullet.GetComponent<RigidBody>();
    rb.velocity = speed * barrel.forward;
    audioSource.PlayOneShot(audioClip);
    Destroy(spawnedBullet, 2);
  }
}
```

Go the the `XR Grab Interactable` on the gun, find the `On Activate` Interactable Event, drag in the Gun and then and then set the function to the `Fire` function.

The activation trigger is controlled on the Controller object `Activate Usage` (and defaults to Trigger).

# User interface

Ray Interaction: https://www.youtube.com/watch?v=4tW7XpAiuDg

Create a new UI Canvas.

- Set Render Mode to `World Space`
- Set the Event Camera to the `Main Camera`

Reduce to the canvas scale to `0.001`, `0.001`, `0.001`

Add a `Tracked Device Graphic Raycaster` component to the canvas

On the `Event System` object

- Remove the `Standalone Input System` component
- Add an `XRUI Input Module` component

## Inverse Kinematics

Get the free synty assets: https://assetstore.unity.com/packages/3d/props/polygon-starter-pack-low-poly-3d-art-by-synty-156819

Switch to My Assets: ![](https://rpl.cat/uploads/8hm5kOtxB_ae4DXMH_XAOcE2hU1uXI8TWE9jpVuJhUo/public.png)

![](https://rpl.cat/uploads/T1uuMGvOgXH4rRtLY-iMQIdgiuI7YcRvRSI3WkQoz1o/public.png)

Click download
Click import

Click import on there: ![](https://rpl.cat/uploads/h8XuYopink_A6P5iDLreVdOZQh0tcbOceQ_NAG44Knk/public.png)

Go into Polygon starter ![](https://rpl.cat/uploads/BMm7ndfVL-yWdGi7zhioSv2i5eLvvi3FR-W4wX4jslM/public.png)

Oh no its pink: ![](https://rpl.cat/uploads/th2fHBMfRRU2xe2Mtxs137I8gqdNVSnr1nWdbQGp-Tg/public.png)

Edit / Render Pipeline / Universal Render Pipeline / Upgrade Project Materials to UniversalRP Materials

Click Proceed ![](https://rpl.cat/uploads/qxsa4HSMgir374frzHsuAkKPeKFT6H4ywpL_YeqyA1w/public.png)

It may look pink but dont worry

Save scene

Add a SM_Character_Male_01 prefab asset to the scene. Rename `SM_Character_Male_01` to `Character`. Right click, Prefab / Unpack completely. Hold option and click it to fully expand.

![](https://rpl.cat/uploads/393kf_6_2kq7cCKnOcFkAt0AxQMF_KQDSi8TdzodfaI/public.png)

Notice that the character comes with the geometry of both the Male and Female character:

![](https://rpl.cat/uploads/tNqcUcJBr_VI7kBootT7sFei8xyCDp_jFAzGk1OG3hA/public.png)

In the Package Manager, in the Unity Registry: import Animation Rigging

![](https://rpl.cat/uploads/ba_7xECxdsehcvUh3ltO9pMz3mVjJKLJcwu_aW21YBU/public.png)

Click `Install`

Select the character, go to the Animation Rigging menu and click Bone Renderer Setup. Now you should see the bones in the scene.

Select the character, go to the Animation Rigging menu and click Rig Setup. Rename the newly created rig to `Upper Body`.

Add an empty object called `IK_Hand_R` and add a `Two Bone IK Constraint` to it.

Lock the inspector.

![](https://rpl.cat/uploads/gNoxqLkFUjupNTij7ioRs_QQaA_lPVyoth3ZuGTbYEo/public.png)

Click on the right hand in the scene and drag it to the `IK_Hand_R` object `Tip` property.

![](https://rpl.cat/uploads/rtfl8BKVolvatOOSCMSb9yj5I8lNxcQneYRWlL3Qy1A/public.png)

Right click on the `Two Bone IK Constraint` component title and click and select `Auto Setup from Tip Transform`:

![](https://rpl.cat/uploads/1H80M-3FR77F4mwpaQAW9sjhe07QT0oygOJqyEg8-Ak/public.png)

This should have created a target called `IK_Hand_R_target`. Select it (first!) and then select the hand simultaneously (using command) and then in the Animation Rigging menu, click Align Transform. Do the same for the `IK_Hand_R_hint` and the elbow (the object used for the `Mid` property).

Next, unlock the inspector and select the `IK_Hand_R_hint` and move it slightly behind the elbow. For example set the Z to `-0.2`.

Do all of that for the left hand.

Inside of the Upper Body, create a new empty object called `IK_Head`. Add a `Multi-Parent Constraint` to it. Drag the `Head` to the `IK_Head` object `Constrained Object` property.

Create a new child empty object called `IK_Head_target` and then align it to the `Head` object.

Drag the target in the the `IK_Head` Source Objects list.

- Valem - Inverse Kinematics - Part 1 - https://www.youtube.com/watch?v=tBYl-aSxUe0&list=RDCMUCPJlesN59MzHPPCp0Lg8sLw&index=1
- Valem - Inverse Kinematics - Part 2 - https://www.youtube.com/watch?v=Wk2_MtYSPaM&list=RDCMUCPJlesN59MzHPPCp0Lg8sLw&index=2
- Valem - Inverse Kinematics - Part 3 - https://www.youtube.com/watch?v=8REDoRu7Tsw&list=RDCMUCPJlesN59MzHPPCp0Lg8sLw&index=3

- Justin P Barnett - Inverse Kinematics in Virtual Reality | VR Upper Body IK Unity Tutorial - https://www.youtube.com/watch?v=MYOjQICbd8I
- Justin P Barnett - Inverse Kinematics in Virtual Reality | VR Lower Body IK Unity Tutorial - https://www.youtube.com/watch?v=1Xr3jB8ik1g

## Level of detail

Adding an input

Add a script TestActionController Script

```
// Add at the top:
using UnityEngine.XR.Interaction.Toolkit
```

```
// Add in the class
private ActionBasedController controller;

void Start() {
  controller = GetComponent<ActionBasedController>();
  controller.selectAction.action.performed += Action_performed;
}

void Update() {
  // You can check inside of update
  bool isPressed = controller.selectAction.action.ReadValue<bool>();
  Debug.Log("Select is pressed in update")
}

private void Action_performed(UnityEngine.InputSystem.InputAction.CallbackContext obj) {
  // throw new System.NotImplementedException();
  Debug.Log("Select button is pressed");
}
```

# Copying an APK to your device and starting it

First connect via adb to your device.

Then copy the APK to your device.

```
adb install -r example.apk
```

(`-r` means `reinstall`)

(`-d Device`)

Then start the app.
