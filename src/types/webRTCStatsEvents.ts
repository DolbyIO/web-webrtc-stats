import { WebRTCStats } from '../webRTCStats';
import { OnStats } from './WebRTCStats';

/**
 * Events triggered by the {@link WebRTCStats} object.
 */
export type WebRTCStatsEvents = {
    /**
     * Event triggered when an error is triggered by this library.
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
     * });
     *
     * collection.on('error', (reason: string) => {
     *     // An error has been triggered
     *     console.error(reason);
     * });
     * ```
     *
     * @param reason The reason of the error.
     */
    error(reason: string): void;

    /**
     * Event triggered when the statistics are available.
     *
     * @example
     * ```ts
     * import { WebRTCStats, OnStats } from '@dolbyio/webrtc-stats';
     *
     * const collection = new WebRTCStats({
     *     getStatsInterval: 1000,
     *     getStats: () => {
     *         // TODO: return the statistics.
     *     },
     * });
     *
     * collection.on('stats', (stats: OnStats) => {
     *     // The statistics are available
     *     console.log(stats);
     * });
     * ```
     *
     * @param stats The {@link OnStats} object that contains the collected WebRTC statistics.
     */
    stats(stats: OnStats): void;
};
