import { Surah, SurahDetail, PrayerInfo } from '../types/islamic';
import surahsData from './surahs.json';

export async function getSurahs(): Promise<Surah[]> {
  return surahsData as Surah[];
}

export async function getSurahText(surahNumber: number): Promise<SurahDetail> {
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
  const data = await res.json();
  return data.data;
}

export async function getSurahTafsir(surahNumber: number): Promise<SurahDetail> {
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.muyassar`);
  const data = await res.json();
  return data.data;
}

export async function getPrayerTimesByCity(city: string = 'Cairo', country: string = 'Egypt'): Promise<PrayerInfo | null> {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
}

export async function getPrayerTimesByLocation(lat: number, lng: number): Promise<PrayerInfo | null> {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=5`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching prayer times by loc:", error);
    return null;
  }
}

export async function getQibla(lat: number, lng: number): Promise<number | null> {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`);
    const data = await res.json();
    return data.data.direction;
  } catch (error) {
    console.error("Error fetching qibla:", error);
    return null;
  }
}
