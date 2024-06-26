import { WebRTCStatsOptions } from './options';

/**
 * Represents the base of the statistics object.
 */
export interface StatsBase {
    /** A unique id that is associated with the object that was inspected to produce this {@link StatsBase} object. */
    id: string;
    /** The timestamp, associated with this object. The time is relative to the UNIX epoch (Jan 1, 1970, UTC). */
    timestamp: number;
    /** Media stream "identification-tag" negotiated and present in the local and remote descriptions. */
    mid?: string;
    /** Current bitrate in bytes per second. */
    bitrate?: number;
    /** Current packet rate in packets per second. */
    packetRate?: number;
}

/**
 * Represents the MIME type of the codec.
 */
export interface StatsCodec {
    /** The codec MIME media type/subtype. e.g., video/vp8 or equivalent. */
    mimeType?: string;
}

/**
 * The enum representing a reason for limiting the resolution and/or framerate, or `none` if not limited.
 *
 * @see [RTCQualityLimitationReason](https://w3c.github.io/webrtc-stats/#rtcqualitylimitationreason-enum)
 */
export enum QualityLimitationReason {
    /** The resolution and/or framerate is not limited. */
    'none',
    /** The resolution and/or framerate is primarily limited due to CPU load. */
    'cpu',
    /**
     * The resolution and/or framerate is primarily limited due to congestion cues during bandwidth estimation.
     * Typical, congestion control algorithms use inter-arrival time,
     * round-trip time, packet or other congestion cues to perform bandwidth estimation.
     */
    'bandwidth',
    /** The resolution and/or framerate is primarily limited for a reason other than the above. */
    'other',
}

/**
 * Represents the base statistics object for an output stream.
 */
export interface OutputBase extends StatsBase, StatsCodec {
    /** Total number of bytes sent for this SSRC. */
    totalBytesSent?: number;
    /** Number of bytes sent for this SSRC since last collection. */
    bytesSentDelta?: number;
    /** Total number of packets sent for this SSRC. */
    totalPacketsSent?: number;
    /** Number of packets sent for this SSRC since last collection. */
    packetsSentDelta?: number;
    /**
     * Reflects the current encoder target in bits per second.
     * The target is an instantaneous value reflecting the encoder's settings,
     * but the resulting payload bytes sent per second, excluding retransmissions,
     * should closely correlate to the target.
     */
    targetBitrate?: number;
    /** The total number of packets that were retransmitted for this SSRC. */
    retransmittedPacketsSent?: number;
    /** Number of packets that were retransmitted for this SSRC since last collection. */
    retransmittedPacketsSentDelta?: number;
    /**
     * The total number of bytes that were retransmitted for this SSRC,
     * only including payload bytes.
     */
    retransmittedBytesSent?: number;
    /**
     * Number of bytes that were retransmitted for this SSRC,
     * only including payload bytes since last collection.
     */
    retransmittedBytesSentDelta?: number;
}

/**
 * Represents the statistics object for an output audio stream.
 */
export interface OutputAudio extends OutputBase {}

/**
 * Represents the statistics object for an output video stream.
 */
export interface OutputVideo extends OutputBase {
    /** Represents the width of the last encoded frame. */
    frameWidth?: number;
    /** Represents the height of the last encoded frame. */
    frameHeight?: number;
    /** The number of encoded frames during the last second. */
    framesPerSecond?: number;
    /** Represents the total number of frames sent on this RTP stream. */
    framesSent?: number;
    /** The current reason for limiting the resolution and/or framerate, or "none" if not limited. */
    qualityLimitationReason: QualityLimitationReason;
    /** A record of the total time, in seconds, that this stream has spent in each quality limitation state. */
    qualityLimitationDurations?: Record<string, number>;
}

/**
 * Represents the statistics object for an input audio stream.
 */
export interface InputAudio extends StatsBase, StatsCodec {
    /** The value of the MediaStreamTrack's id attribute. */
    trackIdentifier: string;
    /** Packet Jitter measured in seconds for this SSRC. */
    jitter?: number;
    /**
     * The purpose of the jitter buffer is to recombine RTP packets into frames (in the case of video) and have smooth playout.
     * The model described here assumes that the samples or frames are still compressed and have not yet been decoded.
     * It is the sum of the time, in seconds, each audio sample or a video frame takes from the time the first packet
     * is received by the jitter buffer (ingest timestamp) to the time it exits the jitter buffer (emit timestamp).
     */
    jitterBufferDelay?: number;
    /** The total number of audio samples or video frames that have come out of the jitter buffer (increasing {@link jitterBufferDelay}). */
    jitterBufferEmittedCount?: number;
    /** Total number of bytes received for this SSRC. */
    totalBytesReceived?: number;
    /** Total number of packets received for this SSRC. */
    totalPacketsReceived?: number;
    /**
     * Total number of RTP packets lost for this SSRC.
     * Note that because of how this is estimated, it can be negative if more packets are received than sent.
     */
    totalPacketsLost?: number;
    /** The ratio of packet loss. */
    packetLossRatio?: number;
    /** Number of packets lost since last collection. */
    packetLossDelta?: number;
}

/**
 * Represents the statistics object for an input video stream.
 */
export interface InputVideo extends InputAudio {
    /**
     * Represents the total number of key frames, such as key frames in VP8 [RFC6386]
     * or IDR-frames in H.264 [RFC6184], successfully decoded for this RTP media stream.
     */
    keyFramesDecoded?: number;
    /** Represents the width of the last decoded frame. */
    frameWidth?: number;
    /** Represents the height of the last decoded frame. */
    frameHeight?: number;
    /** Represents the total number of frames correctly decoded for this RTP stream, i.e., frames that would be displayed if no frames are dropped. */
    framesDecoded?: number;
    /** The total number of frames dropped prior to decode or dropped because the frame missed its display deadline for this receiver's track. */
    framesDropped?: number;
    /** The number of decoded frames in the last second. */
    framesPerSecond?: number;
    /** Represents the total number of complete frames received on this RTP stream. This metric is incremented when the complete frame is received. */
    framesReceived?: number;
}

/**
 * Represents the parsed WebRTC statistics collected for an input or output audio & video stream.
 */
export interface AudioVideoCollect<TAudio, TVideo> {
    /** Audio statistics. */
    audio: TAudio[];
    /** Video statistics. */
    video: TVideo[];
}

/**
 * Represents the parsed WebRTC statistics collected.
 */
export interface OnStats {
    /** Gets the time at which the statistics were collected as a string value in ISO format. */
    timestamp: string;
    /** List of audio & video output statistics. */
    output: AudioVideoCollect<OutputAudio, OutputVideo>;
    /** List of audio & video input statistics. */
    input: AudioVideoCollect<InputAudio, InputVideo>;
    /** Raw statistics, if {@link WebRTCStatsOptions.includeRawStats | includeRawStats} is set to `true` in the collection options. */
    rawStats?: RTCStatsReport;
    /**
     * Represents the sum of all round trip time measurements in seconds since the beginning of the session,
     * based on STUN connectivity check [STUN-PATH-CHAR] responses (responsesReceived),
     * including those that reply to requests that are sent in order to verify consent [RFC7675].
     * The average round trip time can be computed from {@link totalRoundTripTime} by dividing it by {@link responsesReceived}.
     */
    totalRoundTripTime?: number;
    /** Represents the total number of connectivity check responses received. */
    responsesReceived?: number;
    /**
     * Represents the latest round trip time measured in seconds, computed from both STUN connectivity checks [STUN-PATH-CHAR],
     * including those that are sent for consent verification [RFC7675].
     */
    currentRoundTripTime?: number;
    /**
     * It is calculated by the underlying congestion control by combining the available
     * bitrate for all the outgoing RTP streams using this candidate pair.
     * The bitrate measurement does not count the size of the IP or other transport layers like TCP or UDP.
     * It is similar to the TIAS defined in [RFC3890], i.e.,
     * it is measured in bits per second and the bitrate is calculated over a 1 second window.
     */
    availableOutgoingBitrate?: number;
    /**
     * It is calculated by the underlying congestion control by combining the available
     * bitrate for all the incoming RTP streams using this candidate pair.
     * The bitrate measurement does not count the size of the IP or other transport layers like TCP or UDP.
     * It is similar to the TIAS defined in [RFC3890], i.e.,
     * it is measured in bits per second and the bitrate is calculated over a 1 second window.
     */
    availableIncomingBitrate?: number;
}
