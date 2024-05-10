[![Build Package](https://github.com/DolbyIO/web-webrtc-stats/actions/workflows/build-package.yml/badge.svg)](https://github.com/DolbyIO/web-webrtc-stats/actions/workflows/build-package.yml)
[![Build Documentation](https://github.com/DolbyIO/web-webrtc-stats/actions/workflows/build-documentation.yml/badge.svg)](https://github.com/DolbyIO/web-webrtc-stats/actions/workflows/build-documentation.yml)
[![Publish Package](https://github.com/DolbyIO/web-webrtc-stats/actions/workflows/publish-package.yml/badge.svg)](https://github.com/DolbyIO/web-webrtc-stats/actions/workflows/publish-package.yml)
[![npm](https://img.shields.io/npm/v/@dolbyio/webrtc-stats)](https://www.npmjs.com/package/@dolbyio/webrtc-stats)
[![License](https://img.shields.io/github/license/DolbyIO/web-webrtc-stats)](LICENSE)

# Dolby.io WebRTC Statistics

This project is a library to use to parse WebRTC statistics.

## Install this project

Run the following npm command to install the package `@dolbyio/webrtc-stats` into your project:

```bash
npm install @dolbyio/webrtc-stats
```

## Use the library

### Collection

A `WebRTCStats` object needs to be created to start a WebRTC statistics collection. It requires some settings to configure how you want the collection to work. First, import the `WebRTCStats` definition.

```ts
import { WebRTCStats } from '@dolbyio/webrtc-stats';
```

Create the collection object like this example:

```ts
const collection = new WebRTCStats({
    getStats: () => {
        // Get the raw WebRTC statistics from the web browser
    },
    getStatsInterval: 1000,
    includeRawStats: true,
});
```

Start the collection with the `start()` function.

```ts
collection.start();
```

Stop the collection with the `stop()` function.

```ts
collection.stop();
```

### Events

After starting the collection, the `stats` event is triggered when the WebRTC statistics have been collected and parsed.

```ts
import { OnStats } from '@dolbyio/webrtc-stats';

collection.on('stats', (event: OnStats) => {
    console.log(event);
});
```

The `error` event is triggered when an error happens during the collection or the parsing of the WebRTC statistics.

```ts
collection.on('error', (reason: string) => {
    console.error(reason);
});
```

### Example

Example on how to start a statistics collection from the [Dolby Millicast](https://docs.dolby.io/streaming-apis/docs) SDK.

```ts
import { WebRTCStats, OnStats } from '@dolbyio/webrtc-stats';
import { Director, Publish } from '@millicast/sdk';

const PUBLISHER_TOKEN = '';
const STREAM_NAME = '';

const tokenGenerator = () =>
    Director.getPublisher({
        token: PUBLISHER_TOKEN,
        streamName: STREAM_NAME,
    });

const publisher = new Publish(STREAM_NAME, tokenGenerator);

// HERE: Publish a stream to Dolby Millicast

const collection = new WebRTCStats({
    getStatsInterval: 1000,
    getStats: () => {
        return publisher.webRTCPeer.getRTCPeer().getStats();
    },
});

// The stats event is triggered after each interval has elapsed
collection.on('stats', (event: OnStats) => {
    console.log(event);
});

// Start the statistics collection
collection.start();
```

## Logs

You can also print the logs in the console and select the log level by using the following code.

```ts
import { Logger } from '@dolbyio/webrtc-stats';

Logger.useDefaults({
    defaultLevel: Logger.TRACE,
});
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

The documentation is built on [TypeDoc](https://typedoc.org), to generate the doc, run the following command. You will find the HTML files in the `docs` folder.

```bash
npm run docs
```

## Related Projects

-   [Millicast SDK](https://github.com/millicast/millicast-sdk)
-   [js-logger](https://github.com/jonnyreeves/js-logger)
-   [TypeDoc](https://typedoc.org)
-   [Jest](https://jestjs.io/)
