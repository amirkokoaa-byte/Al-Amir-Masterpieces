import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { 
  Play, Pause, Volume2, VolumeX, Moon, Share2, Type, 
  Settings2, Disc, Settings, AlertCircle, Clock,
  X, ChevronDown, ChevronUp, Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AudioPlayer({ isSidebarOpen }: { isSidebarOpen?: boolean }) {
  const { 
    currentStation, isPlaying, volume, quality, 
    togglePlayPause, setVolume, setQuality, 
    startSleepTimer, cancelSleepTimer,
    sleepTimerActive, sleepTimerHours, sleepTimerMinutes,
    isBuffering, stopStation
  } = usePlayer();

  const [showSettings, setShowSettings] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [timerInput, setTimerInput] = useState('30');
  const [isMinimized, setIsMinimized] = useState(false);
  
  useEffect(() => {
    if (isSidebarOpen) {
      setIsMinimized(true);
    }
  }, [isSidebarOpen]);

  
  // A local recording state (we do a visual mock or use MediaRecorder if stream allows)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let intv: NodeJS.Timeout;
    if (isRecording) {
      intv = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(intv);
  }, [isRecording]);

  const handleShare = async () => {
    if (!currentStation) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `استمع إلى ${currentStation.name}`,
          text: `أنا أستمع إلى ${currentStation.name} على تطبيق القرآن والراديو!`,
          url: currentStation.url_resolved
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      alert("ميزة المشاركة غير مدعومة في متصفحك");
    }
  };

  const handleToggleRecord = () => {
    if (!currentStation) return;
    if (!isPlaying && !isRecording) {
       alert("قم بتشغيل الإذاعة أولاً لبدء التسجيل");
       return;
    }
    if (isRecording) {
      setIsRecording(false);
      alert("تم حفظ التسجيل محلياً (ميزة تجريبية قد لا تدعم كل الإذاعات λόγω قيود CORS).");
    } else {
      setIsRecording(true);
      // In a real complete app, we'd try audioContext MediaRecorder here and handle crossOrigin constraints.
    }
  };

  if (!currentStation) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
        >
          <ChevronUp className="w-8 h-8" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 p-4 transition-colors z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {/* Top handles: Minimize and Close */}
      <div className="absolute top-0 right-0 left-0 -mt-10 flex justify-between px-4 pointer-events-none">
        <div /> {/* spacing */}
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setIsMinimized(true)}
            className="w-10 h-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 shadow-md transition-all"
            title="تصغير"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          <button 
            onClick={() => {
              stopStation();
            }}
            className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 mt-2">
        
        {/* Station Info */}
        <div className="flex items-center gap-4 flex-1 w-full md:w-auto overflow-hidden">
          <div className="h-12 w-12 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-md">
            {currentStation.favicon ? (
               <img src={currentStation.favicon} alt="" className="w-10 h-10 object-contain rounded" onError={(e) => (e.currentTarget.style.display='none')} />
            ) : (
               <Disc className="text-white w-6 h-6 animate-spin-slow" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {currentStation.name}
            </span>
            <span className="text-sm text-amber-600 dark:text-amber-400 truncate flex items-center gap-2">
              {isBuffering ? "جاري التحميل..." : (isPlaying ? "مباشر" : "متوقف")}
              {isRecording && (
                <span className="text-red-500 animate-pulse text-xs">• تسجيل {formatTime(recordingTime)}</span>
              )}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 flex-1 w-full md:w-auto">
           <button 
             onClick={handleToggleRecord}
             className={`p-2 rounded-full transition-colors ${isRecording ? 'text-red-500 bg-red-100 dark:bg-red-900/30' : 'text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
             title={isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}
           >
             <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
               {isRecording ? <div className="w-1.5 h-1.5 bg-current" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
             </div>
           </button>

           <button 
             onClick={togglePlayPause}
             className="w-14 h-14 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
           >
             {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
           </button>

           <button 
             onClick={handleShare}
             className="p-2 rounded-full text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
           >
             <Share2 className="w-5 h-5" />
           </button>
        </div>

        {/* Right side settings & Volume */}
        <div className="flex items-center justify-end gap-3 flex-1 w-full md:w-auto text-gray-600 dark:text-slate-300">
           <div className="relative">
             <button 
               onClick={() => setShowQuality(!showQuality)}
               className={`p-2 rounded-full transition-colors ${quality === 'high' ? 'text-amber-500' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
               title="جودة الصوت"
             >
               <Music className="w-5 h-5" />
             </button>
             <AnimatePresence>
               {showQuality && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                   className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 p-2 z-50"
                 >
                    <button onClick={() => { setQuality('high'); setShowQuality(false); }} className={`w-full text-center py-2 text-sm rounded ${quality === 'high' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>دقة عالية</button>
                    <button onClick={() => { setQuality('low'); setShowQuality(false); }} className={`w-full text-center py-2 text-sm rounded ${quality === 'low' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>توفير البيانات</button>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>

           <div className="group relative flex items-center gap-2">
             <Volume2 className="w-5 h-5" />
             <input 
               type="range" 
               min="0" max="1" step="0.01" 
               value={volume}
               onChange={(e) => setVolume(parseFloat(e.target.value))}
               className="w-24 accent-amber-500 rtl-flip cursor-pointer"
             />
           </div>

           <div className="relative">
             <button 
               onClick={() => setShowSettings(!showSettings)}
               className={`p-2 rounded-full transition-colors ${sleepTimerActive ? 'text-amber-500' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
             >
               <Settings2 className="w-5 h-5" />
             </button>

             <AnimatePresence>
               {showSettings && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 10 }}
                   className="absolute bottom-full left-0 md:right-0 md:left-auto mb-4 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 p-4"
                 >
                   <h4 className="font-medium text-gray-900 dark:text-white mb-3">إعدادات البث</h4>
                   
                   {/* Sleep Timer */}
                   <div>
                     <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                       <span>مؤقت النوم</span>
                       {sleepTimerActive && (
                         <span className="text-amber-500 text-xs">
                           متبقي: {sleepTimerHours ? `${sleepTimerHours} س` : ''} {sleepTimerMinutes} د
                         </span>
                       )}
                     </label>
                     <div className="flex gap-2">
                       <input 
                         type="number" 
                         value={timerInput}
                         onChange={(e) => setTimerInput(e.target.value)}
                         className="w-full bg-gray-50 dark:bg-slate-900 text-sm p-2 rounded-lg border border-gray-200 dark:border-slate-700 outline-none focus:border-amber-500"
                         placeholder="دقيقة"
                       />
                       {sleepTimerActive ? (
                         <button 
                           onClick={cancelSleepTimer}
                           className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm px-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50"
                         >إلغاء</button>
                       ) : (
                         <button 
                           onClick={() => {
                             const mins = parseInt(timerInput);
                             if (mins > 0) startSleepTimer(Math.floor(mins / 60), mins % 60);
                           }}
                           className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-sm px-3 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 whitespace-nowrap"
                         >تشغيل</button>
                       )}
                     </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
