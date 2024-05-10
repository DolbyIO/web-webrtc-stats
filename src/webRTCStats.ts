import { EventEmitter } from 'events';
import Logger, { ILogger } from 'js-logger';

import { RTCStatsReport, RTCStats, RTCOutboundRtpStreamStats, RTCInboundRtpStreamStats } from './types/lib.dom';
import { InputAudio, InputVideo, OutputAudio, OutputVideo, OnStats, StatsCodec, OutputBase, QualityLimitationReason } from './types/WebRTCStats';
import { WebRTCStatsOptions } from './types/options';
import { WebRTCStatsEvents } from './types/webRTCStatsEvents';
import { getMediaKind, calculateRate, calculatePacketsLostRatio } from './utils';

export interface WebRTCStats {
    /**
     * Adds the `listener` function to the end of the listeners array for the
     * event named `eventName`. No checks are made to see if the `listener` has
     * already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
     * times.
     *
     * @param eventName The name of the event.
     * @param listener The callback function.
     *
     * @returns A reference to the {@link EventEmitter}, so that calls can be chained.
     */
    on<N extends keyof WebRTCStatsEvents>(eventName: N, listener: WebRTCStatsEvents[N]): this;

    /** @hidden */
    emit<N extends keyof WebRTCStatsEvents>(eventName: N, ...args: Parameters<WebRTCStatsEvents[N]>): boolean;
}

/**
 * Representation of the WebRTC Statistics collection object.
 *
 * @example
 * ```ts
 * import { WebRTCStats } from '@dolbyio/webrtc-stats';
 *
 * const collection = new WebRTCStats({
 *     getStatsInterval: 1000,
 *     getStats: () => {
 *         // TODO: return the statistics.
 *     },
 *     includeRawStats: false,
 * });
 *
 * // The stats event is triggered after each interval has elapsed
 * collection.on('stats', (event: OnStats) => {
 *     console.log(event);
 * });
 *
 * // Start the statistics collection
 * collection.start();
 * ```
 */
export class WebRTCStats extends EventEmitter implements WebRTCStats {
    #getStats: () => Promise<RTCStatsReport>;
    #getStatsInterval: number;
    #includeRawStats: boolean;

    #intervalId: NodeJS.Timer | null = null;
    #logger: ILogger;
    #lastOnStats: OnStats | null = null;

    /**
     * Creates an instance of the {@link WebRTCStats} class.
     *
     * @param options Options for the WebRTC statistics collection.
     */
    constructor(options: WebRTCStatsOptions) {
        super();

        this.#logger = Logger.get('WebRTCStats');
        this.#getStats = options.getStats;
        this.#getStatsInterval = options.getStatsInterval || 1000;
        this.#includeRawStats = !!options.includeRawStats;
    }

    /**
     * Starts the WebRTC statistics collection.
     */
    public start = () => {
        this.#logger.info('WebRTC statistics collection is starting...');
        this.#lastOnStats = null;

        this.#intervalId = setInterval(this.#parseStats, this.#getStatsInterval);
    };

    /**
     * Stops the WebRTC statistics collection.
     */
    public stop = () => {
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
            this.#logger.info('WebRTC statistics collection has stopped.');
        }
    };

    #parseStats = async () => {
        let rtcStatsReport: RTCStatsReport;
        let timestamp: string;
        try {
            this.#logger.trace('Requesting WebRTC statistics...');
            rtcStatsReport = await this.#getStats();
            timestamp = new Date().toISOString();
        } catch (error) {
            this.#logger.error('Problem collecting the WebRTC statistics.', error);
            this.emit('error', `Problem collecting the WebRTC statistics - ${error}`);

            return;
        }

        const statistics: RTCStats[] = Array.from(rtcStatsReport.values());

        const eventPayload: OnStats = {
            timestamp: timestamp,
            input: {
                audio: [],
                video: [],
            },
            output: {
                audio: [],
                video: [],
            },
        };

        if (this.#includeRawStats) {
            eventPayload.rawStats = rtcStatsReport;
        }

        for (let i = 0; i < Object.keys(statistics).length; i++) {
            const entry: RTCStats = statistics[i];

            switch (entry.type) {
                case 'outbound-rtp':
                    const outEntry: RTCOutboundRtpStreamStats = entry as RTCOutboundRtpStreamStats;
                    const outMediaKind = getMediaKind(outEntry);
                    if (outMediaKind === 'audio') {
                        await this.#parseOutboundRtpAudio(rtcStatsReport, outEntry, eventPayload);
                    } else if (outMediaKind === 'video') {
                        await this.#parseOutboundRtpVideo(rtcStatsReport, outEntry, eventPayload);
                    }
                    break;

                case 'inbound-rtp':
                    const inEntry: RTCInboundRtpStreamStats = entry as RTCInboundRtpStreamStats;
                    let inMediaKind = getMediaKind(inEntry);
                    if (inMediaKind === 'audio') {
                        await this.#parseInboundRtpAudio(rtcStatsReport, inEntry, eventPayload);
                    } else if (inMediaKind === 'video') {
                        await this.#parseInboundRtpVideo(rtcStatsReport, inEntry, eventPayload);
                    }
                    break;

                case 'candidate-pair':
                    const cpEntry: RTCIceCandidatePairStats = entry as RTCIceCandidatePairStats;
                    if (cpEntry.nominated) {
                        this.#parseCandidatePair(cpEntry, eventPayload);
                    }
                    break;

                default:
                    // "candidate-pair" | "certificate" | "codec" | "data-channel" | "local-candidate"
                    // | "media-source" | "peer-connection" | "remote-candidate" | "remote-inbound-rtp"
                    // | "remote-outbound-rtp" | "track" | "transport";
                    break;
            }
        }

        this.#lastOnStats = eventPayload;
        this.emit('stats', eventPayload);
    };

    #getCodec(rtcStatsReport: RTCStatsReport, codecId?: string): StatsCodec {
        if (codecId) {
            const codec: RTCRtpCodecParameters = rtcStatsReport.get(codecId) as RTCRtpCodecParameters;
            if (codec) {
                return {
                    mimeType: codec.mimeType,
                };
            }
        }

        return {};
    }

    async #getOutputBase(rtcStatsReport: RTCStatsReport, entry: RTCOutboundRtpStreamStats, last: OutputAudio): Promise<OutputBase> {
        const bitrate = calculateRate(entry.timestamp, entry.bytesSent, last?.timestamp, last?.totalBytesSent);
        const packetRate = calculateRate(entry.timestamp, entry.packetsSent, last?.timestamp, last?.totalPacketsSent);
        const codec = this.#getCodec(rtcStatsReport, entry.codecId);

        const outputBase: OutputBase = {
            id: entry.id,
            timestamp: entry.timestamp,
            mid: entry.mid,
            totalBytesSent: entry.bytesSent,
            bytesSentDelta: entry.bytesSent - (last?.totalBytesSent ?? 0),
            totalPacketsSent: entry.packetsSent,
            packetsSentDelta: entry.packetsSent - (last?.totalPacketsSent ?? 0),
            bitrate: bitrate,
            packetRate: packetRate,
            targetBitrate: entry.targetBitrate,
            retransmittedPacketsSent: entry.retransmittedPacketsSent,
            retransmittedPacketsSentDelta: entry.retransmittedPacketsSent - (last?.retransmittedPacketsSent ?? 0),
            retransmittedBytesSent: entry.retransmittedBytesSent,
            retransmittedBytesSentDelta: entry.retransmittedBytesSent - (last?.retransmittedBytesSent ?? 0),
            ...codec,
        };

        return outputBase;
    }

    async #parseOutboundRtpAudio(rtcStatsReport: RTCStatsReport, entry: RTCOutboundRtpStreamStats, eventPayload: OnStats) {
        const last: OutputAudio = this.#lastOnStats?.output.audio.find((a) => a.id === entry.id);
        if (last && entry.timestamp - last.timestamp <= 0) return;

        const outputBase: OutputBase = await this.#getOutputBase(rtcStatsReport, entry, last);

        const outputAudio: OutputAudio = {
            ...outputBase,
        };

        eventPayload.output.audio.push(outputAudio);
    }

    async #parseOutboundRtpVideo(rtcStatsReport: RTCStatsReport, entry: RTCOutboundRtpStreamStats, eventPayload: OnStats) {
        const last: OutputVideo = this.#lastOnStats?.output.video.find((a) => a.id === entry.id);
        if (last && entry.timestamp - last.timestamp <= 0) return;

        const outputBase: OutputBase = await this.#getOutputBase(rtcStatsReport, entry, last);

        let qualityLimitationReason: QualityLimitationReason = QualityLimitationReason.none;
        if (entry.qualityLimitationReason) {
            qualityLimitationReason = entry.qualityLimitationReason as unknown as QualityLimitationReason;
        }

        const outputVideo: OutputVideo = {
            ...outputBase,
            frameWidth: entry.frameWidth,
            frameHeight: entry.frameHeight,
            framesPerSecond: entry.framesPerSecond,
            framesSent: entry.framesSent,
            qualityLimitationReason: qualityLimitationReason,
            qualityLimitationDurations: entry.qualityLimitationDurations,
        };

        eventPayload.output.video.push(outputVideo);
    }

    async #getInputAudio(rtcStatsReport: RTCStatsReport, entry: RTCInboundRtpStreamStats, last: InputAudio): Promise<InputAudio> {
        const bitrate = calculateRate(entry.timestamp, entry.bytesReceived, last?.timestamp, last?.totalBytesReceived);
        const packetRate = calculateRate(entry.timestamp, entry.packetsReceived, last?.timestamp, last?.totalPacketsReceived);
        const packetLossRatio = calculatePacketsLostRatio(entry.packetsReceived, entry.packetsLost, last?.totalPacketsReceived, last?.totalPacketsLost);
        const packetLossDelta = (entry.packetsLost ?? 0) - (last?.totalPacketsLost ?? 0);
        const codec = this.#getCodec(rtcStatsReport, entry.codecId);

        const inputAudio: InputAudio = {
            id: entry.id,
            timestamp: entry.timestamp,
            mid: entry.mid,
            trackIdentifier: entry.trackIdentifier,
            jitter: entry.jitter,
            jitterBufferDelay: entry.jitterBufferDelay,
            jitterBufferEmittedCount: entry.jitterBufferEmittedCount,
            totalBytesReceived: entry.bytesReceived,
            totalPacketsReceived: entry.packetsReceived,
            totalPacketsLost: entry.packetsLost,
            bitrate: bitrate,
            packetRate: packetRate,
            packetLossRatio: packetLossRatio,
            packetLossDelta: packetLossDelta,
            ...codec,
        };
        return inputAudio;
    }

    async #parseInboundRtpAudio(rtcStatsReport: RTCStatsReport, entry: RTCInboundRtpStreamStats, eventPayload: OnStats) {
        const last: InputAudio = this.#lastOnStats?.input.audio.find((a) => a.id === entry.id);
        if (last && entry.timestamp - last.timestamp <= 0) return;

        const inputAudio: InputAudio = await this.#getInputAudio(rtcStatsReport, entry, last);

        eventPayload.input.audio.push(inputAudio);
    }

    async #parseInboundRtpVideo(rtcStatsReport: RTCStatsReport, entry: RTCInboundRtpStreamStats, eventPayload: OnStats) {
        const last: InputVideo = this.#lastOnStats?.input.video.find((a) => a.id === entry.id);
        if (last && entry.timestamp - last.timestamp <= 0) return;

        const inputAudio: InputAudio = await this.#getInputAudio(rtcStatsReport, entry, last);

        const inputVideo: InputVideo = {
            ...inputAudio,
            keyFramesDecoded: entry.keyFramesDecoded,
            frameHeight: entry.frameHeight,
            frameWidth: entry.frameWidth,
            framesDecoded: entry.framesDecoded,
            framesDropped: entry.framesDropped,
            framesPerSecond: entry.framesPerSecond,
            framesReceived: entry.framesReceived,
        };

        eventPayload.input.video.push(inputVideo);
    }

    #parseCandidatePair(entry: RTCIceCandidatePairStats, eventPayload: OnStats) {
        eventPayload.totalRoundTripTime = entry.totalRoundTripTime;
        eventPayload.currentRoundTripTime = entry.currentRoundTripTime;
        eventPayload.responsesReceived = entry.responsesReceived;
        eventPayload.availableOutgoingBitrate = entry.availableOutgoingBitrate;
        eventPayload.availableIncomingBitrate = entry.availableIncomingBitrate;
    }
}
