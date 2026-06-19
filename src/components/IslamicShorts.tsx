import React, { useState, useRef, useEffect } from 'react';
import { Play, Share2, User } from 'lucide-react';

const SHORTS_DATA = [
  {
    "id": 1,
    "title": "فضل قراءة سورة الإخلاص",
    "speaker": "الشيخ محمد متولي الشعراوي",
    "category": "خواطر تفسيرية",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/112.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1584226761916-3fd8ea209041?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ فضل قراءة سورة الإخلاص عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  },
  {
    "id": 2,
    "title": "تلاوة تهتز لها القلوب من سورة مريم",
    "speaker": "الشيخ عبد الباسط عبد الصمد",
    "category": "تلاوات خاشعة ومؤثرة",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal/2250.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ تلاوة تهتز لها القلوب من سورة مريم عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  },
  {
    "id": 3,
    "title": "ماذا تفعل إذا ضاقت بك الدنيا؟",
    "speaker": "د. عمر عبد الكافي",
    "category": "فوائد فقهية سريعة",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy/2.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1498409785965-8b3d752dd307?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ ماذا تفعل إذا ضاقت بك الدنيا؟ عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  },
  {
    "id": 4,
    "title": "مواقف من حياة النبي ﷺ",
    "speaker": "الشيخ بدر المشاري",
    "category": "سيرة نبوية ميسرة",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.hudhaify/3.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1519817914152-2a24ec083b49?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ مواقف من حياة النبي ﷺ عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  },
  {
    "id": 5,
    "title": "معنى (اهدنا الصراط المستقيم)",
    "speaker": "الشيخ محمد متولي الشعراوي",
    "category": "خواطر تفسيرية",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.husary/6.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1606707764192-3626e257cc7a?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ معنى (اهدنا الصراط المستقيم) عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  },
  {
    "id": 6,
    "title": "راحة نفسية تلاوة هادئة",
    "speaker": "مشاري العفاسي",
    "category": "تلاوات خاشعة ومؤثرة",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/255.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ راحة نفسية تلاوة هادئة عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  },
  {
    "id": 7,
    "title": "حكم صلاة الوتر للشباب",
    "speaker": "الشيخ ابن عثيمين",
    "category": "فوائد فقهية سريعة",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.minshawi/7.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1513220455823-38dbbc42ef33?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ حكم صلاة الوتر للشباب عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  },
  {
    "id": 8,
    "title": "قصة هجرة النبي ﷺ بدقيقة",
    "speaker": "د. طارق السويدان",
    "category": "سيرة نبوية ميسرة",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.sudais/8.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ قصة هجرة النبي ﷺ بدقيقة عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  },
  {
    "id": 9,
    "title": "خواتيم سورة البقرة",
    "speaker": "الشيخ ماهر المعيقلي",
    "category": "تلاوات خاشعة ومؤثرة",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly/285.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ خواتيم سورة البقرة عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  },
  {
    "id": 10,
    "title": "الصبر على البلاء",
    "speaker": "الشيخ الشعراوي",
    "category": "خواطر تفسيرية",
    "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.husary/10.mp3",
    "thumbnail_url": "https://images.unsplash.com/photo-1541818296061-0bc25c9bd09e?auto=format&fit=crop&w=600&q=80",
    "share_text": "استمع لـ الصبر على البلاء عبر تطبيق روائع الأمير للقرآن والسُنّة: https://app.example.com"
  }
];

export function IslamicShorts() {
  const [shorts, setShorts] = useState<typeof SHORTS_DATA>(SHORTS_DATA);

  useEffect(() => {
    const saved = localStorage.getItem('islamic_shorts');
    if (saved) {
      try {
        setShorts(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  return (
    <div className="w-full max-w-[400px] mx-auto h-[75vh] min-h-[550px] bg-black rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative ring-1 ring-white/20">
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-slate-900 scroll-smooth">
        {shorts.map((short) => (
          <ShortItem key={short.id} data={short} />
        ))}
      </div>
    </div>
  );
}

function ShortItem({ data }: { data: typeof SHORTS_DATA[0] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          audioRef.current?.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Auto-play prevented
            setIsPlaying(false);
          });
        } else {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          setIsPlaying(false);
        }
      },
      { threshold: 0.7 } // trigger when 70% visible
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().then(() => setIsPlaying(true));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: data.share_text
      }).catch(console.error);
    } else {
      alert('تم نسخ النص للمشاركة!');
      navigator.clipboard.writeText(data.share_text);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full snap-start relative group cursor-pointer" 
      onClick={togglePlay}
    >
      {/* Background Image */}
      <img 
        src={data.thumbnail_url} 
        alt={data.title}
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />
      
      {/* Audio Player */}
      <audio 
        ref={audioRef} 
        preload="none"
        loop 
        playsInline 
        className="hidden" 
      >
        <source src={data.audio_url} type="audio/mpeg" />
      </audio>

      {/* Play/Pause Overlay Icon */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${!isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
          <Play className="w-10 h-10 text-white fill-white ml-2" />
        </div>
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3 pb-8 text-right z-10" dir="rtl">
        <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg w-fit shadow-md border border-white/20">
          {data.category}
        </span>
        <h3 className="text-white font-bold text-2xl leading-tight drop-shadow-lg">{data.title}</h3>
        <div className="flex items-center gap-2 text-gray-200 text-sm font-medium drop-shadow-md">
          <User className="w-4 h-4 text-blue-400" /> {data.speaker}
        </div>
      </div>

      {/* Side Actions */}
      <div className="absolute left-4 bottom-24 flex flex-col gap-5 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); handleShare(); }} 
          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/20 shadow-xl"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
