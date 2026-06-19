import React, { useState, useEffect, useRef } from 'react';
import { getSurahs, getSurahText, getSurahTafsir } from '../lib/islamicApi';
import { Surah, SurahDetail, Ayah } from '../types/islamic';
import { BookOpen, Copy, BookmarkPlus, Loader2, Play, Square, Volume2 } from 'lucide-react';

const RECITERS = [
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد' },
  { id: 'ar.abdurrahmaansudais', name: 'عبد الرحمن السديس' },
  { id: 'ar.alafasy', name: 'مشاري العفاسي' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي' },
  { id: 'ar.ahmedajamy', name: 'أحمد بن علي العجمي' },
  { id: 'ar.husary', name: 'محمود خليل الحصري' },
  { id: 'ar.hudhaify', name: 'علي الحذيفي' },
];

export function QuranReader({ viewMode = 'read' }: { viewMode?: 'read' | 'tafsir' }) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahText, setSurahText] = useState<SurahDetail | null>(null);
  const [surahTafsir, setSurahTafsir] = useState<SurahDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingViewer, setLoadingViewer] = useState(false);
  const [savedTafsirs, setSavedTafsirs] = useState<{ayahText: string, tafsir: string}[]>([]);
  
  // Audio state
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isTafsirPlaying, setIsTafsirPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSurahs();
    const saved = localStorage.getItem('saved_tafsirs');
    if (saved) setSavedTafsirs(JSON.parse(saved));
  }, []);

  // When view mode changes, stop playing
  useEffect(() => {
    stopAudio();
    stopTafsirAudio();
  }, [viewMode]);

  const fetchSurahs = async () => {
    const list = await getSurahs();
    setSurahs(list || []);
    setLoadingList(false);
  };

  const loadSurah = async (number: number) => {
    setSelectedSurah(number);
    setLoadingViewer(true);
    stopAudio();
    stopTafsirAudio();
    const [text, tafsir] = await Promise.all([
      getSurahText(number),
      getSurahTafsir(number)
    ]);
    setSurahText(text);
    setSurahTafsir(tafsir);
    setLoadingViewer(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم النسخ بنجاح"); 
  };

  const copySurah = () => {
    if (!surahText) return;
    const fullText = surahText.ayahs.map(a => `${a.text} ﴿${a.numberInSurah}﴾`).join(' ');
    copyToClipboard(fullText);
  };

  const saveTafsir = (ayahText: string, tafsir: string) => {
    const newSaved = [...savedTafsirs, { ayahText, tafsir }];
    setSavedTafsirs(newSaved);
    localStorage.setItem('saved_tafsirs', JSON.stringify(newSaved));
    alert("تم حفظ التفسير في المفضلة");
  };

  const toggleTafsirAudio = (text: string, ayahNumber: number) => {
    if (!('speechSynthesis' in window)) {
      alert("خاصية نطق النص غير مدعومة في متصفحك");
      return;
    }
    
    if (isTafsirPlaying === ayahNumber) {
      window.speechSynthesis.cancel();
      setIsTafsirPlaying(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      // High quality voice if available
      const voices = window.speechSynthesis.getVoices();
      const arVoices = voices.filter(v => v.lang.startsWith('ar'));
      if (arVoices.length > 0) utterance.voice = arVoices[0];
      
      utterance.onend = () => setIsTafsirPlaying(null);
      utterance.onerror = () => setIsTafsirPlaying(null);
      
      window.speechSynthesis.speak(utterance);
      setIsTafsirPlaying(ayahNumber);
    }
  };

  const stopTafsirAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsTafsirPlaying(null);
  };

  const playAyahAudio = (ayahNumberInQuran: number, surahNumber: number, ayahInSurah: number) => {
    if (playingAyah === ayahNumberInQuran) {
      stopAudio();
      return;
    }
    stopAudio();
    stopTafsirAudio();
    
    if (audioRef.current) {
      // High quality audio endpoint 128kbps or higher
      audioRef.current.src = `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${ayahNumberInQuran}.mp3`;
      audioRef.current.play().then(() => {
        setPlayingAyah(ayahNumberInQuran);
      }).catch((err: any) => {
        if (err.name === 'AbortError') return;
        console.error("Audio playback error:", err);
        alert("تعذر تشغيل هذه الآية بصوت القارئ المختار حالياً.");
        setPlayingAyah(null);
      });
      
      // Auto play next ayah
      audioRef.current.onended = () => {
        if (surahText && ayahInSurah < surahText.numberOfAyahs) {
           const nextAyah = surahText.ayahs.find(a => a.numberInSurah === ayahInSurah + 1);
           if (nextAyah) playAyahAudio(nextAyah.number, surahNumber, nextAyah.numberInSurah);
        } else {
           setPlayingAyah(null);
        }
      };
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingAyah(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      <audio ref={audioRef} />
      
      {/* Surah List Sidebar */}
      <div className="w-full lg:w-1/3 glass-panel p-4 h-[650px] overflow-y-auto glow-hover custom-scrollbar">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-200/50 dark:border-slate-700 pb-2">
          <BookOpen className="text-amber-500" /> فهرس السور
        </h3>
        {loadingList ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-amber-500 w-8 h-8" /></div>
        ) : (
          <div className="space-y-2">
            {surahs.map(surah => (
              <button
                key={surah.number}
                onClick={() => loadSurah(surah.number)}
                className={`w-full text-right p-3 rounded-xl transition-colors flex justify-between items-center border ${selectedSurah === surah.number ? 'bg-amber-500/20 shadow-inner border-amber-500' : 'bg-white/30 dark:bg-black/20 border-transparent hover:border-amber-200/50 dark:hover:border-slate-600'}`}
              >
                <div>
                  <span className="font-bold">{surah.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">آياتها {surah.numberOfAyahs}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-slate-800/50 flex items-center justify-center text-xs font-bold font-mono text-amber-600 shadow-sm border border-white/20">
                  {surah.number}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reader Area */}
      <div className="w-full lg:w-2/3 glass-panel p-6 h-[650px] flex flex-col glow-hover">
        {!selectedSurah ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 opacity-60 font-medium">
            اختر سورة من القائمة للقراءة والتفسير والاستماع
          </div>
        ) : loadingViewer ? (
          <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-amber-500 w-12 h-12" /></div>
        ) : surahText && surahTafsir ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200/50 dark:border-slate-700 gap-4">
              <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-serif drop-shadow-sm">{surahText.name}</h2>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select 
                  value={selectedReciter} 
                  onChange={(e) => {
                    setSelectedReciter(e.target.value);
                    stopAudio();
                  }}
                  className="bg-white/50 dark:bg-slate-900/50 border border-amber-500/30 rounded-lg p-2 text-sm font-medium outline-none backdrop-blur-sm focus:border-amber-500 transition-colors"
                >
                  {RECITERS.map(r => (
                    <option key={r.id} value={r.id} className="bg-white dark:bg-slate-900">{r.name}</option>
                  ))}
                </select>

                <button 
                  onClick={copySurah}
                  className="flex items-center gap-2 text-sm bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 px-3 py-2 rounded-lg transition-colors border border-white/20 shadow-sm"
                >
                  <Copy className="w-4 h-4" /> نسخ
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-8 font-serif leading-loose text-xl text-justify custom-scrollbar">
               {surahText.number !== 1 && surahText.number !== 9 && (
                 <div className="text-center font-bold text-2xl mb-8 text-amber-700 dark:text-amber-300 drop-shadow-md">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
               )}
               {surahText.ayahs.map((ayah, idx) => (
                 <div key={ayah.numberInSurah} className="group relative break-words border-b border-gray-100/30 dark:border-slate-800/50 pb-6 mb-6 last:border-0 hover:bg-white/30 dark:hover:bg-black/20 p-4 rounded-2xl transition-all border border-transparent hover:border-white/20 backdrop-blur-sm">
                   
                   <p className={`mb-4 text-2xl leading-loose transition-colors ${playingAyah === ayah.number ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}>
                     {ayah.text} <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-amber-500/50 text-xs font-mono text-amber-600 dark:text-amber-400 mx-1 bg-amber-500/10 shadow-inner">{ayah.numberInSurah}</span>
                   </p>

                   <div className="flex gap-2 justify-end mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => playAyahAudio(ayah.number, surahText.number, ayah.numberInSurah)} 
                       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-all shadow-sm ${playingAyah === ayah.number ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950 hover:bg-amber-600'}`}
                       title={playingAyah === ayah.number ? "إيقاف التلاوة" : "استماع للتلاوة"}
                     >
                       {playingAyah === ayah.number ? <><Square className="w-4 h-4 fill-current"/> إيقاف</> : <><Play className="w-4 h-4 fill-current"/> استماع</>}
                     </button>
                   </div>

                   {viewMode === 'tafsir' && (
                     <div className="bg-gray-100/60 dark:bg-slate-900/60 p-4 rounded-xl border border-gray-200/50 dark:border-slate-700/50 mt-4 backdrop-blur-md">
                       <div className="flex justify-between items-center mb-3">
                         <span className="text-sm font-bold text-amber-700 dark:text-amber-400">التفسير الميسر</span>
                         <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                           <button 
                             onClick={() => toggleTafsirAudio(surahTafsir.ayahs[idx].text, ayah.number)} 
                             className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg font-sans transition-colors ${isTafsirPlaying === ayah.number ? 'bg-red-500 text-white' : 'bg-slate-500 text-white hover:bg-slate-600'}`}
                             title="تشغيل / إيقاف التفسير الصوتي"
                           >
                             {isTafsirPlaying === ayah.number ? <Square className="w-3 h-3 fill-current"/> : <Volume2 className="w-3 h-3"/>}
                             {isTafsirPlaying === ayah.number ? 'إيقاف' : 'صوت'}
                           </button>
                           <button onClick={() => copyToClipboard(surahTafsir.ayahs[idx].text)} className="p-1.5 bg-white/60 dark:bg-slate-700/60 rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-colors border border-white/20" title="نسخ التفسير">
                             <Copy className="w-4 h-4" />
                           </button>
                           <button onClick={() => saveTafsir(ayah.text, surahTafsir.ayahs[idx].text)} className="p-1.5 bg-white/60 dark:bg-slate-700/60 rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-colors border border-white/20" title="حفظ التفسير">
                             <BookmarkPlus className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                       <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed font-sans mt-2">
                         {surahTafsir.ayahs[idx].text}
                       </p>
                     </div>
                   )}
                   
                 </div>
               ))}
            </div>
          </>
        ) : null}
      </div>

    </div>
  );
}
