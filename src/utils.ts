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
    if (totalPacketsReceived == 0) {
        return 0;
    }

    const currentLostPackages = totalPacketsLost - (lastTotalPacketsLost ?? 0);
    const currentReceivedPackages = totalPacketsReceived - (lastTotalPacketsReceived ?? 0);
    return currentLostPackages / currentReceivedPackages;
};
