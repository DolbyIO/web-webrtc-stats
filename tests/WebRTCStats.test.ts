import first from './webRTCStats/first.json';
import second from './webRTCStats/second.json';
import codec from './webRTCStats/codec.json';
import noCodec from './webRTCStats/noCodec.json';
import parseCandidatePair from './webRTCStats/parseCandidatePair.json';
import { WebRTCStats, OnStats } from '../src/';

const getLocalStats = (data: any) => {
    return new Promise<RTCStatsReport>((r) => {
        const ts = new Date().getTime();
        const map = new Map();
        for (let i = 0; i < Object.keys(data).length; i++) {
            const element: any = data[i];
            if (element.timestamp) {
                element.timestamp = ts;
            }
            map.set(element.id, element);
        }
        return r(map);
    });
};

const getResult = (data: any): Promise<OnStats> => {
    return new Promise<OnStats>(async (resolve, reject) => {
        try {
            const collection = new WebRTCStats({
                getStatsInterval: 1000,
                getStats: () => getLocalStats(data),
                includeRawStats: true,
            });

            var result: OnStats | null = null;
            const onStatsEvent = jest.fn((event: OnStats) => {
                result = event;
            });
            collection.on('stats', onStatsEvent);

            collection.start();
            await new Promise((r) => setTimeout(r, 1500));
            collection.stop();

            expect(onStatsEvent).toHaveBeenCalled();

            if (result) {
                expect((result as OnStats).rawStats).toBeDefined();
                expect((result as OnStats).rawStats).not.toBeNull();
                resolve(result);
            } else {
                reject('No results were loaded!');
            }
        } catch (error) {
            reject(error);
        }
    });
};

describe('webRTCStats', () => {
    test('webRTCStats should match the snapshot', () => {
        const collection = new WebRTCStats({
            getStatsInterval: 100,
            getStats: () => getLocalStats(first),
        });

        expect(collection).toMatchSnapshot();
    });

    test('start / stop', async () => {
        const expectedCalls = 2;
        const interval = 50;
        jest.setTimeout((expectedCalls + 2) * interval);

        const collection = new WebRTCStats({
            getStatsInterval: interval,
            getStats: () => getLocalStats(first),
        });

        const onStatsEvent = jest.fn((_) => {});
        collection.on('stats', onStatsEvent);

        collection.start();
        await new Promise((r) => setTimeout(r, expectedCalls * interval + 50));
        collection.stop();

        expect(onStatsEvent).toHaveBeenCalledTimes(expectedCalls);
    });

    test('getStatsInterval', async () => {
        const expectedCalls = 2;
        const defaultInterval = 1000;
        jest.setTimeout((expectedCalls + 2) * defaultInterval);

        const collection = new WebRTCStats({
            getStats: () => getLocalStats(first),
        });

        const onStatsEvent = jest.fn((_) => {});
        collection.on('stats', onStatsEvent);

        collection.start();
        await new Promise((r) => setTimeout(r, expectedCalls * defaultInterval + 500));
        collection.stop();

        expect(onStatsEvent).toHaveBeenCalledTimes(expectedCalls);
    });

    test('getStats exception', async () => {
        const collection = new WebRTCStats({
            getStatsInterval: 100,
            getStats: () => {
                throw 'Problem';
            },
        });

        const onErrorEvent = jest.fn((_) => {});
        collection.on('error', onErrorEvent);

        collection.start();
        await new Promise((r) => setTimeout(r, 150));
        collection.stop();

        expect(onErrorEvent).toHaveBeenCalled();
    });

    test('codec', async () => {
        const result: OnStats = await getResult(codec);
        expect(result.output.video).toHaveLength(1);
        expect(result.output.video[0].mimeType).toEqual('video/H264');

        const result2: OnStats = await getResult(noCodec);
        expect(result2.output.video).toHaveLength(1);
        expect(result2.output.video[0].mimeType).toBeUndefined();
    });

    test('parseCandidatePair', async () => {
        const result = await getResult(parseCandidatePair);

        expect(result.totalRoundTripTime).toEqual(0.275);
        expect(result.currentRoundTripTime).toEqual(0.07);
        expect(result.availableOutgoingBitrate).toEqual(2752533);
    });
});
