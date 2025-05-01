import { RTCRtpStreamStats } from './types/lib.dom';

export const getMediaKind = (rtcStats: RTCRtpStreamStats): string => {
    let mediaKind = rtcStats.kind || rtcStats.mediaType;

    // Safari is missing mediaType and kind for 'inbound-rtp'
    if (!['audio', 'video'].includes(mediaKind) && rtcStats.type === 'inbound-rtp') {
        if (rtcStats.id.toLocaleLowerCase().includes('video')) mediaKind = 'video';
        else mediaKind = 'audio';
    }

    return mediaKind;
};

export const calculateRate = (timestamp: number, value: number, lastTimestamp?: number, lastValue?: number): number => {
    if (lastTimestamp && lastValue) {
        return (value - lastValue) / ((timestamp - lastTimestamp) / 1000);
    }

    return 0;
};

export const calculatePacketsLostRatio = (
    totalPacketsLost: number,
    totalPacketsReceived: number,
    lastTotalPacketsLost?: number,
    lastTotalPacketsReceived?: number
): number => {
    const currentLostPackets = totalPacketsLost - (lastTotalPacketsLost ?? 0);
    const currentReceivedPackets = totalPacketsReceived - (lastTotalPacketsReceived ?? 0);
    const currentPacketsExpected = currentLostPackets + currentReceivedPackets;

    if (currentPacketsExpected === 0) {
        return 0;
    }

    return currentLostPackets / currentPacketsExpected;
};
