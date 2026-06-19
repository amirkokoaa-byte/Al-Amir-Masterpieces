import { Station } from '../types';

const API_BASE = 'https://de1.api.radio-browser.info/json/stations';

export async function searchStations(query: string, limit: number = 30): Promise<Station[]> {
  try {
    const params = new URLSearchParams({
      name: query,
      limit: limit.toString(),
      hidebroken: 'true',
      order: 'clickcount',
      reverse: 'true'
    });
    
    if (!query) {
      params.delete('name');
      params.set('tag', 'quran,islamic,arabic');
    }

    const response = await fetch(`${API_BASE}/search?${params.toString()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data: Station[] = await response.json();
    
    // Filter out HTTP-only streams to avoid Mixed Content errors in the browser
    return data.filter(station => station.url_resolved?.startsWith('https://'));
  } catch (error) {
    console.error("Error fetching stations", error);
    return [];
  }
}

export async function getStationById(uuid: string): Promise<Station | null> {
  try {
    const response = await fetch(`${API_BASE}/byuuid/${uuid}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data: Station[] = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error fetching station", error);
    return null;
  }
}

export async function getQuranRecitersRadios(): Promise<Station[]> {
  try {
    const response = await fetch('https://mp3quran.net/api/v3/radios?language=ar');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    if (data.radios) {
      return data.radios.map((r: any) => ({
        stationuuid: `mp3quran-${r.id}`,
        name: r.name,
        url: r.url,
        url_resolved: r.url,
        tags: 'quran,recitation',
        country: '',
        language: 'arabic',
        favicon: '',
        bitrate: 128
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching reciters", error);
    return [];
  }
}

export const DEFAULT_STATIONS: Station[] = [
  {
    stationuuid: 'ertu-quran-egypt',
    name: 'إذاعة القرآن الكريم من القاهرة',
    url: 'https://stream.radiojar.com/8s5u5tpdtwzuv',
    url_resolved: 'https://stream.radiojar.com/8s5u5tpdtwzuv',
    tags: 'quran,islamic,egypt',
    country: 'Egypt',
    language: 'arabic',
    favicon: '',
    bitrate: 128
  },
  {
    stationuuid: 'default-1',
    name: 'إذاعة القرآن الكريم (السعودية)',
    url: 'https://quransrv.quran-makkah.com/quran',
    url_resolved: 'https://quransrv.quran-makkah.com/quran',
    tags: 'quran,islamic',
    country: 'Saudi Arabia',
    language: 'arabic',
    favicon: '',
    bitrate: 128
  },
  {
    stationuuid: 'mp3quran-alfasy',
    name: 'تلاوات - مشاري العفاسي',
    url: 'https://backup.qurango.net/radio/mishary_alafasi',
    url_resolved: 'https://backup.qurango.net/radio/mishary_alafasi',
    tags: 'quran',
    country: 'Kuwait',
    language: 'arabic',
    favicon: '',
    bitrate: 128
  }
];
