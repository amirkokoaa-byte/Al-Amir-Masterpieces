export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  tags: string;
  country: string;
  language: string;
  favicon: string;
  bitrate: number;
}

export interface AppState {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  favorites: string[];
  sleepTimer: number | null; 
  quality: 'high' | 'low';
}

export interface ProgramAlert {
  id: string;
  stationId: string;
  stationName: string;
  programName: string;
  time: string; // HH:mm format
  days: number[]; // 0-6, 0 is Sunday
  enabled: boolean;
}
