// Expose the logger to control when/where to log
export { default as Logger } from 'js-logger';

import WebRTCStats, { WebRTCStatsEvents } from './webRTCStats';

export default WebRTCStats;
export { WebRTCStatsEvents };
export * from './types/WebRTCStats';
