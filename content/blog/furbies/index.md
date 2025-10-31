---
title: More Than You Ever Wanted to Know About Furbies
date: '2025-06-14T00:01:00'
published: true
slug: furbies
comments: https://github.com/jeffrafter/jeffrafter.github.io/issues/67
image: ../../assets/furby.jpg
layout: post
tags: ['furbies', 'furby', 'hacks', 'bluetooth', 'ai']
category: hacks
excerpt: Furby is probably the most advanced, well designed, impossibly elegant child's toy that exists. They might be the key to unlocking the emotion of pair-programming.
---

<figure class="">
![More than you ever wanted to know about Furbies](../../assets/furby.png)
</figure>
<figcaption class="fullwidth">
</figcaption>

Furby is probably the most advanced, well designed, impossibly elegant child's toy that exists and could be the key to unlocking the emotion of pair-programming. Seemingly the stuff of nightmares: these small talking robots dance and sing and clamor for your attention, but as a developer or user experience designer it is an almost perfect medium.

## The Original Furby

Furby was originally released in 1998. According to Wikipedia: "Furbies were the first successful attempt to produce and sell a domestically aimed robot." 27 million sold in 12 months. The original Furby was a marvel.

Since then, countless projects have emerged leveraging the Furby platform. The original Furby had a 16-bit microcontroller, a speaker, and a few sensors, and was programmed to respond to voice commands and could learn new words. Furby was a closed system but was hacked and reverse engineered by many people.

Furbies were so advanced the FAA, the Navy, and the NSA all issued warnings about the dangers of these small robots. The NSA warned that Furbies should not be allowed into secure areas and [the FAA declared furbies could not be activated on airplanes below 10,000 feet](https://www.faa.gov/media/19696).

All of this might make you think Furbies are evil. But how can they be evil when you can ue them to make this:

<iframe width="560" height="315" src="https://www.youtube.com/embed/GYLBjScgb7o?si=ZHEUA8CnVhRtIH3W" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

If you want to understand their language (Furbish), look no further than the [official furby wiki](https://official-furby.fandom.com/wiki/Furbish_(language)).

Or if you want to see the original ASM code; see [here](https://www.seanriddle.com/furbysource.pdf) or [here](https://github.com/gnomon-/furby-source).

## Furby Connect

Hasbro released the Furby Connect in 2012. Surprisingly, mad hordes of shoppers weren't tackling one another in shopping aisles to purchase the last one. There were no warnings from the FAA and the NSA. If they had understood the unbridled power of the Furby Connect things might have been different. From the outside, the Furby Connect is a dancing, singing robotic toy much like its predecessor - but it was upgraded with two LCD screens for eyes, a Bluetooth radio, and a companion app. The app allows you to control the Furby Connect and play games with it as well as connect to the Internet and download new content.

All of this makes it shockingly easy to hack.

### Hacking the Furby Connect

There have been some fantastic hacks of the Furby Connect, luckily very often released as open source.

Maybe you want to [investigate the audio protocol](https://github.com/iafan/Hacksby).

Maybe you want to [use the Bluetooth connection to control the Furby](https://github.com/pdjstone/furby-web-bluetooth) via a web browser.

Looking for an advanced bluetooth library you can use from Node? Check out [bluefluff](https://github.com/Jeija/bluefluff):

<iframe width="560" height="315" src="https://www.youtube.com/embed/FkblA_CxHgU?si=SEK1cWsnqiRdbik5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The `contextis` blog is now gone, but the [Wayback Machine](https://web.archive.org/web/20210119092151/https://www.contextis.com/us/blog/dont-feed-them-after-midnight-reverse-engineering-the-furby-connect) has a copy of the post about reverse engineering the Furby Connect. The associated [GitHub repository](https://github.com/ctxis/Furby) is still available.

Chloe Condon's Beginner's Guide to Hacking Furbies is a great resource for getting started with Furby hacking. It covers the basics of how to connect to a Furby, how to control it, and how to create your own custom commands. https://medium.com/@chloecondon/how-to-hack-your-furby-connect-a-beginners-guide-d4337c458296

Some other notable projects include:

* Furby Hax by [swarley7](https://github.com/swarley7/furbhax/blob/master/WeHaveNoIdea2017.pdf)
* Hacksby by [iafan](https://github.com/iafan/Hacksby)
* Furby-2012 by [mncoppola](https://github.com/mncoppola/Furby-2012) - this includes the [General Plus datasheet and the audio protocol](https://github.com/mncoppola/Furby-2012/blob/master/datasheets/GPY0033AV10_ds.pdf)

## Hack-week

At GitHub, we would occasionalky hold hack-weeks and hackathons with specific themes. Nothing is better than being surrounded by some of the most creative and talented engineers in the world and being told: make something cool. In 2019 we held a hack-week with the focus of _collaborative coding_. The theme was only a guideline: projects around pull requests, discovery, workspaces and more were all demoed at the end of the week. There was a fantastic video of a dog riding a skateboard introducing a new way to ship code. I had an... _unusual_ idea and recruited [`@d12`](https://github.com/d12), [`@tclem`](https://github.com/tclem), and [`@nixpad`](https://github.com/nixpad) to form a team focused on "pair coding".

At the end of the week, this was our demo to the company:

<demo>

This demo was entirely unscripted. The Furby was reacting completely organically and in realtime to what `@tclem` was doing in his Atom editor.

# Teaching Furby to Code

Furbies can do many things; but they can't code. In fact, they can't see your computer, screen, or editor. To make this possible we wrote a small Electron application that would connect to the Furby and handle all of the commands. All of this is possible because the Furby Connect is very hackable and can be controlled via bluetooth with no authentication. You can scan for active Furbies and pair with them directly.

## Save on batteries

Furby Connects come with little NFC plants that they can 'eat'. They munch on the plants and say they are satisfied. It is cute. But what Furbies really eat are batteries - we found ourselves draining the batteries in a couple of hours. Because of this we took one small side-quest: we wired our Furbies to power so they could be plugged in. Normally the Furby takes 2 AA batteries - but the voltage requirements are actually pretty flexible. You can safely run on 5V / 1A - meaning you can just wire the power from a USB plug to the Furby. This meant we could just plug them into our computers and they would power up.

## Writing a Furby CLI

To keep things simple we'll start by writing a CLI for our Furbies. We only have one dependency: [Noble](https://github.com/abandonware/noble.git). Noble is a library that allows you to connect to Bluetooth Low Energy (BLE) devices. This works on a Mac and has been updated over the years as MacOS has changed.

By default, our CLI will create a `furbies` collection and start scanning for any nearby BLE advertisements of type `Furby`. Let's start by creating `furbies.js`:

```js
class Furbies {
  constructor() {
    this.connections = {};
  }

  add(uuid, furby) {
    this.connections[uuid] = furby;
  }
}

const furbies = new Furbies();

module.exports = furbies;
```

We'll expand on this considerably.

Next we'll create our `scanner.js`:

```js
const noble = require('@abandonware/noble')
const fluffcon = require('./fluffcon')

module.exports = (callback) => {
  noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
      noble.startScanning(undefined, false, undefined)
    } else {
      noble.stopScanning()
    }
  })

  noble.on('discover', function(peripheral) {
    if (peripheral.advertisement.localName === 'Furby') {
      console.log('Discovered Furby: ' + peripheral.uuid)

      // Normal server mode
      fluffcon.connect(peripheral, function(fluff) {
        callback(peripheral, fluff)
      })
    }
  })
}
```

We referred to `fluffcon.js`. This is the primary file for communicating with the Furby over Bluetooth. The Furby's main chip is a GeneralPlus processor with a Nordic Bluetooth antenna. The identifiers for these are very stable (so that Furbies can easily communicate with the companion app and with each other).

Here is `fluffcon.js` (almost all of this comes directly from Jeija's `bluefluff` library):

```js
const noble = require("@abandonware/noble");

/*
 * Bluetooth LE GATT Services and Characteristics
 * We only care about the "FLUFF" service and its characteristics here.
 * I have no idea if the given UUIDs have any meaning or are just random.
 * They are hardcoded into all Furbies and into the Furby Connect World App.
 */
const FURBY = {
  SERVICE : {
    FLUFF : "dab91435b5a1e29cb041bcd562613bde"
  },
  CHARACTERISTIC : {
    GENERALPLUS_WRITE : "dab91383b5a1e29cb041bcd562613bde",
    GENERALPLUS_LISTEN : "dab91382b5a1e29cb041bcd562613bde",
    NORDIC_WRITE : "dab90757b5a1e29cb041bcd562613bde",
    NORDIC_LISTEN : "dab90756b5a1e29cb041bcd562613bde",
    RSSI_LISTEN : "dab90755b5a1e29cb041bcd562613bde",
    FILEWRITE : "dab90758b5a1e29cb041bcd562613bde"
  }
};

// Handle Ctrl+C or other SIGINT events and make sure we close our connection
// Otherwise, Furby will remain in a state where it doesn't accept any connection attempts.
function exitHandler(furby) {
  process.on("SIGINT", function() {
    console.log("[Furby] Closing connection...");
    furby.disconnect(function(error) {
      if (error)
        console.log("[Furby] Error while disconnecting: " + error);
      else
        console.log("[Furby] Disconnected, exiting.");
    });
  });
}

// Get GATT characteristic matching serviceUUID and characteristicUUID from Furby peripheral.
// callback is a function(characteristic), where characteristic is a noBLE characteristic.
function getFurbyCharacteristics(furby, serviceUUID, characteristicUUIDs, callback) {
  furby.discoverServices([serviceUUID], function(error, services) {
    if (error) {
      console.log("[Furby] Error in discoverServices: " + error);
      return;
    }

    services[0].discoverCharacteristics(characteristicUUIDs, function(error, characteristics) {
      if (error) {
        console.log("[Furby] Error in discoverCharacteristics: " + error);
        return;
      }

      // Regroup characteristics by their UUIDs
      let charByUUID = {};
      characteristics.forEach(function(c) {
        charByUUID[c.uuid] = c;
      });
      callback(charByUUID);
    });
  });
}

/*
 * Fluff Class
 * The Fluff Class defines a connection to a single Furby Connect device. Multiple connections
 * to different Furbies can coexist at the same time. This class contains all functions necessary
 * for interfacing with Furby connect. It does not handle connection status etc. though,
 * since that requires asynchronous operation. The Fluff class tries to not expose unnecessary
 * asynchronous functionality such as error handling to the outside, since Furby's actions tend
 * to follow a sequential pattern.
 */
class Fluff {
  constructor(gpWrite, gpListen, nWrite, nListen, rssiListen, fileWrite) {
    this.gpWrite = gpWrite;
    this.gpListen = gpListen;
    this.nWrite = nWrite;
    this.nListen = nListen;
    this.rssiListen = rssiListen;
    this.fileWrite = fileWrite;

    // Initialize empty list of callbacks
    this.gpCallbacks = [];
    this.nCallbacks = [];

    this.startIdle();
    this.subscribeNotifications();
  }

  // Write one command to GeneralPlusWrite characteristic
  generalPlusWrite(data, callback) {
    this.gpWrite.write(data, true, function(error) {
      if (error) {
        console.log("[Furby] Error in generalPlusWrite: " + error);
        if (callback) callback("generalPlusWrite: " + error);
      } else {
        console.log("[Furby] generalPlusWrite: " + data.toString("hex"));
        if (callback) callback(false);
      }
    });
  }

  // Write a sequence of commands to GeneralPlusWrite characteristic
  generalPlusWriteSequence(sequence, callback) {
    let i = 0;

    let nextSeq = (function() {
      if (i < sequence.length) {
        this.gpWrite.write(sequence[i], true, function(error) {
          if (error) {
            console.log("[Furby] Error in generalPlusWriteSequence: " + error);
            if (callback) callback("generalPlusWriteSequence: " + error);
            return;
          }

          i++;
          nextSeq();
        });
      } else {
        if (callback) callback(false);
      }
    }).bind(this);

    nextSeq();
  }

  // Write data to NordicWrite characteristic
  nordicWrite(data, callback) {
    this.nWrite.write(data, true, function(error) {
      if (error) {
        console.log("[Furby] Error in nordicWrite: " + error);
        if (callback) callback("nordicWrite: " + error);
      } else {
        console.log("[Furby] nordicWrite: " + data.toString("hex"));
        if (callback) callback(false);
      }
    });
  }

  // Write data to slot, maximum 20 bytes
  writeToSlot(data, callback) {
    this.fileWrite.write(data, true, function(error) {
      if (error) {
        console.log("[Furby] Error in writeToSlot: " + error);
        if (callback) callback("writeToSlot: " + error);
      } else {
        console.log("[Furby] writeToSlot: " + data.toString("hex"));
        if (callback) callback(false);
      }
    });
  }

  // Subscribe to GeneralPlusListen, RSSIListen and NordicListen characteristics
  subscribeNotifications() {
    this.nListen.on("data", (data, isNotification) => {
      console.log("[Furby] Nordic notification: " + data.toString("hex"));
      for (let c of this.nCallbacks)
        c(data);
    });

    this.gpListen.on("data", (data, isNotification) => {
      console.log("[Furby] GP notification: " + data.toString("hex"));
      for (let c of this.gpCallbacks)
        c(data);
    });

    this.rssiListen.on("data", (data, isNotification) => {
      console.log("[Furby] RSSI notification: " + data.toString("hex"));
    });

    this.nListen.subscribe((error) => {
      if (error)
        console.log("[Furby] Error while subscribing to NordicListen: " + error);
    });

    this.gpListen.subscribe((error) => {
      if (error)
        console.log("[Furby] Error while subscribing to GeneralPlusListen: " + error);
    });

    this.rssiListen.subscribe((error) => {
      if (error)
        console.log("[Furby] Error while subscribing to RSSIListen: " + error);
    });
  }

  startIdle() {
    // Furby will start talking and moving if not somehow employed with something else to do.
    // Therefore, we can just feed it some empty 0x00 commands so that it doesn't start talking.
    // The app does this with 20:06 packets that trigger SendImHereSignal answers in 3 second interval,
    // but we can just use whatever we want.
    this.idleInterval = setInterval(this.generalPlusWrite.bind(this, new Buffer([0x00])), 3000);
  }

  stopIdle() {
    clearInterval(this.idleInterval);
  }

  addGeneralPlusCallback(callback) {
    this.gpCallbacks.push(callback);
  }

  addNordicCallback(callback) {
    this.nCallbacks.push(callback);
  }

  // General-Purpose Key-Value storage for actions
  setParam(param, value) {
    this.params[param] = value;
  }

  getParam(param) {
    return this.params[param];
  }
}


module.exports = {}

module.exports.connect = function(furby, callback) {
  furby.connect(function(error) {
    if (error) {
      console.log("[Furby] Error while connecting: " + error);
      return;
    }

    exitHandler(furby);

    let characteristicUUIDs = Object.values(FURBY.CHARACTERISTIC);
    getFurbyCharacteristics(furby, FURBY.SERVICE.FLUFF, characteristicUUIDs, function(characteristics) {
      let gpWrite = characteristics[FURBY.CHARACTERISTIC.GENERALPLUS_WRITE];
      let gpListen = characteristics[FURBY.CHARACTERISTIC.GENERALPLUS_LISTEN];
      let nWrite = characteristics[FURBY.CHARACTERISTIC.NORDIC_WRITE];
      let nListen = characteristics[FURBY.CHARACTERISTIC.NORDIC_LISTEN];
      let rssiListen = characteristics[FURBY.CHARACTERISTIC.RSSI_LISTEN];
      let fileWrite = characteristics[FURBY.CHARACTERISTIC.FILEWRITE];
      console.log("[Furby] Read all fluff characteristics");
      console.log({characteristics})
      const fluff = new Fluff(gpWrite, gpListen, nWrite, nListen, rssiListen, fileWrite)
      console.log("Furby characteristics loaded")
      callback(fluff);
    });

    console.log("[Furby] Connected to Furby");
  });
};

module.exports.introspect = function(furby) {
  exitHandler(furby);

  furby.connect(function(error) {
    if (error) {
      console.log("[Furby] Error while connecting for introspection: " + error);
      return;
    }

    console.log("GATT data structure of furby with UUID " + furby.uuid);
    furby.discoverServices(null, function(error, services) {
      console.log("Furby exposes the following services: ");

      let count = 0;

      // Scan all characteristics
      services.forEach(function(ser, idx) {
        ser.discoverCharacteristics(null, function(error, characteristics) {
          console.log(" " + idx + ") uuid: " + ser.uuid + ", with characteristics: ");
          for (let i in characteristics)
            console.log("    > uuid: " + characteristics[i]);

          count++;
          if (count >= services.length) {
            furby.disconnect(function(error) {
              if (error)
                console.log("[Furby] Error while disconnecting: " + error);
              else
                console.log("[Furby] Disconnected, exiting")

              process.exit();
            });
          }
        });
      });
    });
  });
};
```

## Connect via bluetooth
## Furbish and other commands

# Writing an Atom plugin
# Writing a VSCode plugin

# What makes a good pairing partner?
## Categorizing Furby emotions
## What does this mean for Copilot, Claude Code, Cursor and Windsurf, Zed and the rest?


# See also

* https://www.nytimes.com/2017/12/21/technology/connected-toys-hacking.html?hpw&rref=technology&action=click&pgtype=Homepage&module=well-region&region=bottom-well&WT.nav=bottom-well
* https://en.wikipedia.org/wiki/Furby
* Audio protocols: https://www.youtube.com/watch?v=Xm_RHOWcwOY
