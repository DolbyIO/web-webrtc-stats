[![Build Package](https://github.com/DolbyIO/web-webrtc-stats/actions/workflows/build-package.yml/badge.svg)](https://github.com/DolbyIO/web-webrtc-stats/actions/workflows/build-package.yml)
[![Publish Package](https://github.comDolbyIO/web-webrtc-stats/actions/workflows/publish-package.yml/badge.svg)](https://github.com/DolbyIO/web-webrtc-stats/actions/workflows/publish-package.yml)
[![npm](https://img.shields.io/npm/v/@dolbyio/web-webrtc-stats)](https://www.npmjs.com/package/@dolbyio/web-webrtc-stats)
[![License](https://img.shields.io/github/license/DolbyIO/web-webrtc-stats)](LICENSE)

# Dolby.io WebRTC Statistics

This project is a library to use to parse WebRTS statistics.

## Install this project

Run the npm command to install the package `@dolbyio/webrtc-stats` into your project:

```bash
npm install @dolbyio/webrtc-stats --save
```

## Start a collection

Example on how to start a statistics collection from the [Dolby.io Communications SDK](https://docs.dolby.io/communications-apis/docs).

```js
import WebRTCStats, { WebRTCStatsEvents } from '@dolbyio/webrtc-stats';
import VoxeetSdk from '@voxeet/voxeet-web-sdk';

const collection = new WebRTCStats({
    getStatsInterval: 1000,
    getStats: async () => {
        // See: https://docs.dolby.io/communications-apis/docs/js-client-sdk-conferenceservice#localstats
        const webRTCStats = await VoxeetSDK.conference.localStats();

        // Convert the WebRTCStats object to RTCStatsReport
        const values = Array.from(webRTCStats.values())[0];
        const map = new Map();
        for (let i = 0; i < values.length; i++) {
            const element = values[i];
            map.set(element.id, element);
        }
        return map;
    },
});

// The stats event is triggered after each interval has elapsed
collection.on(WebRTCStatsEvents.stats, (event) => {
    // Triggered when the statistics have been parsed
    console.log(event);
});

// Start the statistics collection
collection.start();
```

## How to

Run tests:

```bash
npm run test
```

Create distribution package:

```bash
npm run build
```
