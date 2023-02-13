import { getMediaKind, calculateRate, calculatePacketsLostRatio } from '../src/utils';
import { RTCRtpStreamStats } from '../src/types/lib.dom';

describe('utils test suite', () => {
    test('utils should match the snapshot', () => {
        expect({
            getMediaKind,
            calculateRate,
            calculatePacketsLostRatio,
        }).toMatchSnapshot();
    });

    test('getMediaKind', () => {
        const rtcStats: RTCRtpStreamStats = {
            kind: '',
            ssrc: 0,
            id: '',
            timestamp: 0,
            type: 'candidate-pair',
        };
        expect(getMediaKind(rtcStats)).toBeUndefined();

        rtcStats.id = '';
        rtcStats.kind = 'video';
        rtcStats.mediaType = undefined;
        rtcStats.type = 'candidate-pair';
        expect(getMediaKind(rtcStats)).toEqual('video');

        rtcStats.id = '';
        rtcStats.kind = '';
        rtcStats.mediaType = 'audio';
        rtcStats.type = 'candidate-pair';
        expect(getMediaKind(rtcStats)).toEqual('audio');

        rtcStats.id = 'ITaudio1V3534943364';
        rtcStats.kind = '';
        rtcStats.mediaType = undefined;
        rtcStats.type = 'candidate-pair';
        expect(getMediaKind(rtcStats)).toBeUndefined();

        rtcStats.id = 'ITaudio1V3534943364';
        rtcStats.kind = '';
        rtcStats.mediaType = undefined;
        rtcStats.type = 'inbound-rtp';
        expect(getMediaKind(rtcStats)).toEqual('audio');

        rtcStats.id = 'OTvideo1A1219987693';
        rtcStats.kind = '';
        rtcStats.mediaType = undefined;
        rtcStats.type = 'inbound-rtp';
        expect(getMediaKind(rtcStats)).toEqual('video');
    });

    test('calculateRate', () => {
        expect(calculateRate(2000, 200)).toEqual(0);
        expect(calculateRate(2000, 200, 1000)).toEqual(0);
        expect(calculateRate(2000, 200, 1000, 100)).toEqual(100);
    });

    test('calculatePacketsLostRatio', () => {
        expect(calculatePacketsLostRatio(100, 0)).toEqual(0);
        expect(calculatePacketsLostRatio(100, 200)).toEqual(0.5);
        expect(calculatePacketsLostRatio(100, 200, 50)).toEqual(0.25);
        expect(calculatePacketsLostRatio(100, 200, 50, 100)).toEqual(0.5);
    });
});
