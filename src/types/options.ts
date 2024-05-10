import { WebRTCStatsEvents } from './webRTCStatsEvents';

/**
 * Options to configure the WebRTC statistics collection.
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
 *     includeRawStats: true,
 * });
 * ```
 */
export interface WebRTCStatsOptions {
    /**
     * Function that will be called to retrieve the WebRTC statistics.
     *
     * @returns a {@link RTCStatsReport} object through a {@link Promise}.
     */
    getStats: () => Promise<RTCStatsReport>;
    /** Interval, in milliseconds, at which to collect the WebRTC statistics. Default is 1,000 ms (1 second). */
    getStatsInterval?: number;
    /** Include the raw statistics in the {@link WebRTCStatsEvents.stats | stats} event. Default is `false`. */
    includeRawStats?: boolean;
}
