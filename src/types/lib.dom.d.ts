export interface RTCAnswerOptions extends RTCOfferAnswerOptions {}

export interface RTCCertificateExpiration {
    expires?: number;
}

export interface RTCConfiguration {
    bundlePolicy?: RTCBundlePolicy;
    certificates?: RTCCertificate[];
    iceCandidatePoolSize?: number;
    iceServers?: RTCIceServer[];
    iceTransportPolicy?: RTCIceTransportPolicy;
    rtcpMuxPolicy?: RTCRtcpMuxPolicy;
}

export interface RTCDTMFToneChangeEventInit extends EventInit {
    tone?: string;
}

export interface RTCDataChannelEventInit extends EventInit {
    channel: RTCDataChannel;
}

export interface RTCDataChannelInit {
    id?: number;
    maxPacketLifeTime?: number;
    maxRetransmits?: number;
    negotiated?: boolean;
    ordered?: boolean;
    protocol?: string;
}

export interface RTCDtlsFingerprint {
    algorithm?: string;
    value?: string;
}

export interface RTCEncodedAudioFrameMetadata {
    contributingSources?: number[];
    synchronizationSource?: number;
}

export interface RTCEncodedVideoFrameMetadata {
    contributingSources?: number[];
    dependencies?: number[];
    frameId?: number;
    height?: number;
    spatialIndex?: number;
    synchronizationSource?: number;
    temporalIndex?: number;
    width?: number;
}

export interface RTCErrorEventInit extends EventInit {
    error: RTCError;
}

export interface RTCErrorInit {
    errorDetail: RTCErrorDetailType;
    httpRequestStatusCode?: number;
    receivedAlert?: number;
    sctpCauseCode?: number;
    sdpLineNumber?: number;
    sentAlert?: number;
}

export interface RTCIceCandidateInit {
    candidate?: string;
    sdpMLineIndex?: number | null;
    sdpMid?: string | null;
    usernameFragment?: string | null;
}

export interface RTCIceCandidatePairStats extends RTCStats {
    availableIncomingBitrate?: number;
    availableOutgoingBitrate?: number;
    bytesReceived?: number;
    bytesSent?: number;
    currentRoundTripTime?: number;
    lastPacketReceivedTimestamp?: DOMHighResTimeStamp;
    lastPacketSentTimestamp?: DOMHighResTimeStamp;
    localCandidateId: string;
    nominated?: boolean;
    remoteCandidateId: string;
    requestsReceived?: number;
    requestsSent?: number;
    responsesReceived?: number;
    responsesSent?: number;
    state: RTCStatsIceCandidatePairState;
    totalRoundTripTime?: number;
    transportId: string;
}

export interface RTCIceServer {
    credential?: string;
    urls: string | string[];
    username?: string;
}

export interface RTCInboundRtpStreamStats extends RTCReceivedRtpStreamStats {
    audioLevel?: number;
    bytesReceived?: number;
    concealedSamples?: number;
    concealmentEvents?: number;
    decoderImplementation?: string;
    estimatedPlayoutTimestamp?: DOMHighResTimeStamp;
    fecPacketsDiscarded?: number;
    fecPacketsReceived?: number;
    firCount?: number;
    frameHeight?: number;
    frameWidth?: number;
    framesDecoded?: number;
    framesDropped?: number;
    framesPerSecond?: number;
    framesReceived?: number;
    headerBytesReceived?: number;
    insertedSamplesForDeceleration?: number;
    jitterBufferDelay?: number;
    jitterBufferEmittedCount?: number;
    keyFramesDecoded?: number;
    lastPacketReceivedTimestamp?: DOMHighResTimeStamp;
    nackCount?: number;
    packetsDiscarded?: number;
    pliCount?: number;
    qpSum?: number;
    remoteId?: string;
    removedSamplesForAcceleration?: number;
    silentConcealedSamples?: number;
    totalAudioEnergy?: number;
    totalDecodeTime?: number;
    totalInterFrameDelay?: number;
    totalProcessingDelay?: number;
    totalSamplesDuration?: number;
    totalSamplesReceived?: number;
    totalSquaredInterFrameDelay?: number;
}

export interface RTCLocalSessionDescriptionInit {
    sdp?: string;
    type?: RTCSdpType;
}

export interface RTCOfferAnswerOptions {}

export interface RTCOfferOptions extends RTCOfferAnswerOptions {
    iceRestart?: boolean;
    offerToReceiveAudio?: boolean;
    offerToReceiveVideo?: boolean;
}

export interface RTCOutboundRtpStreamStats extends RTCSentRtpStreamStats {
    firCount?: number;
    frameHeight?: number;
    frameWidth?: number;
    framesEncoded?: number;
    framesPerSecond?: number;
    framesSent?: number;
    headerBytesSent?: number;
    hugeFramesSent?: number;
    keyFramesEncoded?: number;
    mediaSourceId?: string;
    nackCount?: number;
    pliCount?: number;
    qpSum?: number;
    qualityLimitationResolutionChanges?: number;
    remoteId?: string;
    retransmittedBytesSent?: number;
    retransmittedPacketsSent?: number;
    rid?: string;
    targetBitrate?: number;
    totalEncodeTime?: number;
    totalEncodedBytesTarget?: number;
    totalPacketSendDelay?: number;
}

export interface RTCPeerConnectionIceErrorEventInit extends EventInit {
    address?: string | null;
    errorCode: number;
    errorText?: string;
    port?: number | null;
    url?: string;
}

export interface RTCPeerConnectionIceEventInit extends EventInit {
    candidate?: RTCIceCandidate | null;
    url?: string | null;
}

export interface RTCReceivedRtpStreamStats extends RTCRtpStreamStats {
    jitter?: number;
    packetsLost?: number;
    packetsReceived?: number;
}

export interface RTCRtcpParameters {
    cname?: string;
    reducedSize?: boolean;
}

export interface RTCRtpCapabilities {
    codecs: RTCRtpCodecCapability[];
    headerExtensions: RTCRtpHeaderExtensionCapability[];
}

export interface RTCRtpCodecCapability {
    channels?: number;
    clockRate: number;
    mimeType: string;
    sdpFmtpLine?: string;
}

export interface RTCRtpCodecParameters {
    channels?: number;
    clockRate: number;
    mimeType: string;
    payloadType: number;
    sdpFmtpLine?: string;
}

export interface RTCRtpCodingParameters {
    rid?: string;
}

export interface RTCRtpContributingSource {
    audioLevel?: number;
    rtpTimestamp: number;
    source: number;
    timestamp: DOMHighResTimeStamp;
}

export interface RTCRtpEncodingParameters extends RTCRtpCodingParameters {
    active?: boolean;
    maxBitrate?: number;
    maxFramerate?: number;
    networkPriority?: RTCPriorityType;
    priority?: RTCPriorityType;
    scaleResolutionDownBy?: number;
}

export interface RTCRtpHeaderExtensionCapability {
    uri?: string;
}

export interface RTCRtpHeaderExtensionParameters {
    encrypted?: boolean;
    id: number;
    uri: string;
}

export interface RTCRtpParameters {
    codecs: RTCRtpCodecParameters[];
    headerExtensions: RTCRtpHeaderExtensionParameters[];
    rtcp: RTCRtcpParameters;
}

export interface RTCRtpReceiveParameters extends RTCRtpParameters {}

export interface RTCRtpSendParameters extends RTCRtpParameters {
    degradationPreference?: RTCDegradationPreference;
    encodings: RTCRtpEncodingParameters[];
    transactionId: string;
}

export interface RTCRtpStreamStats extends RTCStats {
    codecId?: string;
    kind: string;
    mediaType?: string;
    ssrc: number;
    transportId?: string;
    mid?: string;
}

export interface RTCRtpSynchronizationSource extends RTCRtpContributingSource {}

export interface RTCRtpTransceiverInit {
    direction?: RTCRtpTransceiverDirection;
    sendEncodings?: RTCRtpEncodingParameters[];
    streams?: MediaStream[];
}

export interface RTCSentRtpStreamStats extends RTCRtpStreamStats {
    bytesSent?: number;
    packetsSent?: number;
}

export interface RTCSessionDescriptionInit {
    sdp?: string;
    type: RTCSdpType;
}

export interface RTCStats {
    id: string;
    timestamp: DOMHighResTimeStamp;
    type: RTCStatsType;
}

export interface RTCTrackEventInit extends EventInit {
    receiver: RTCRtpReceiver;
    streams?: MediaStream[];
    track: MediaStreamTrack;
    transceiver: RTCRtpTransceiver;
}

export interface RTCTransportStats extends RTCStats {
    bytesReceived?: number;
    bytesSent?: number;
    dtlsCipher?: string;
    dtlsState: RTCDtlsTransportState;
    localCertificateId?: string;
    remoteCertificateId?: string;
    selectedCandidatePairId?: string;
    srtpCipher?: string;
    tlsVersion?: string;
}

export interface RTCStatsReport extends ReadonlyMap<string, any> {}
