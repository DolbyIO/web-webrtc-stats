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

## Use the library

### Collection

A `WebRTCStats` object needs to be created to start a WebRTC statistics collection. It requires some settings to configure how you want the collection to work.

```js
interface WebRTCStatsOptions {
    /**
     * Function that will be called to retrieve the WebRTS statistics.
     * @returns a {@link RTCStatsReport} object through a {@link Promise}.
     */
    getStats: () => Promise<RTCStatsReport>;

    /**
     * Interval, in milliseconds, at which to collect the WebRTS statistics.
     * Default is 1,000 ms (1 second).
     */
    getStatsInterval?: number;

    /**
     * Include the raw statistics in the `stats` event.
     * Default is `false`.
     */
    includeRawStats?: boolean;
}
```

Create the collection object.

```js
const collection = new WebRTCStats({
    getStats: () => {
        // Get the raw WebRTC statistics from the web browser
    },
    getStatsInterval: 1000,
    includeRawStats: true,
});
```

Start the collection with the `start()` function.

```js
collection.start();
```

Stop the collection with the `stop()` function.

```js
collection.stop();
```

### Events

After starting the collection, the `stats` event is triggered when the WebRTC statistics have been collected and parsed. The `event` object is of type [OnStats](src/types/WebRTCStats.ts).

```js
collection.on('stats', (event) => {
    console.log(event);
});
```

The `error` event is triggered when an error happens during the collection or the parsing of the WebRTC statistics.

```js
collection.on('error', (error) => {
    console.error(error);
});
```

### Examples

#### Dolby.io Communications APIs

Example on how to start a statistics collection from the [Dolby.io Communications APIs](https://docs.dolby.io/communications-apis/docs).

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

#### Dolby.io Real-time Streaming APIs

Example on how to start a statistics collection from the [Dolby.io Real-time Streaming APIs](https://docs.dolby.io/streaming-apis/docs).

```js
import WebRTCStats, { WebRTCStatsEvents } from '@dolbyio/webrtc-stats';
import { Director, Publish } from '@millicast/sdk';

const PUBLISHER_TOKEN = '';
const STREAM_NAME = '';

const tokenGenerator = () =>
    Director.getPublisher({
        token: PUBLISHER_TOKEN,
        streamName: STREAM_NAME,
    });

const publisher = new Publish(STREAM_NAME, tokenGenerator);

// Publish the stream

const collection = new WebRTCStats({
    getStatsInterval: 1000,
    getStats: () => {
        return publisher.webRTCPeer.getRTCPeer().getStats();
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
