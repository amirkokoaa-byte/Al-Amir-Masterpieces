import React, { useState, useEffect } from 'react';
import { X, Lock, Save, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function ManageSettings({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States to hold modifications
  const [books, setBooks] = useState<any[]>([]);
  const [herbs, setHerbs] = useState<any[]>([]);
  const [shorts, setShorts] = useState<any[]>([]);
  const [surahReciters, setSurahReciters] = useState<any[]>([]);

  useEffect(() => {
    if (authenticated) {
      const load = async () => {
        setIsLoading(true);
        try {
          const docSnap = await getDoc(doc(db, 'settings', 'global'));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBooks(data.islamic_books || []);
            setHerbs(data.prophetic_herbs_books || []);
            setShorts(data.islamic_shorts || []);
            
            // Set default reciters if empty
            const savedReciters = data.surah_reciters || [];
            if (savedReciters.length > 0) {
              setSurahReciters(savedReciters);
            } else {
              setSurahReciters([
                { id: 1, name: "أحمد بن علي العجمي", server_url: "https://server10.mp3quran.net/ajm" },
                { id: 2, name: "مشاري العفاسي", server_url: "https://server8.mp3quran.net/afs" },
                { id: 3, name: "عبد الباسط عبد الصمد", server_url: "https://server7.mp3quran.net/basit" },
                { id: 4, name: "ماهر المعيقلي", server_url: "https://server12.mp3quran.net/maher" },
                { id: 5, name: "سعود الشريم", server_url: "https://server7.mp3quran.net/shur" },
                { id: 6, name: "عبد الرحمن السديس", server_url: "https://server11.mp3quran.net/sds" },
                { id: 7, name: "سعد الغامدي", server_url: "https://server7.mp3quran.net/s_gmd" },
                { id: 8, name: "ياسر الدوسري", server_url: "https://server11.mp3quran.net/yasser" },
                { id: 9, name: "إسلام صبحي", server_url: "https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem" },
                { id: 10, name: "إسلام صابر", server_url: "https://server8.mp3quran.net/saber" }
              ]);
            }
          } else {
              setSurahReciters([
                { id: 1, name: "أحمد بن علي العجمي", server_url: "https://server10.mp3quran.net/ajm" },
                { id: 2, name: "مشاري العفاسي", server_url: "https://server8.mp3quran.net/afs" },
                { id: 3, name: "عبد الباسط عبد الصمد", server_url: "https://server7.mp3quran.net/basit" },
                { id: 4, name: "ماهر المعيقلي", server_url: "https://server12.mp3quran.net/maher" },
                { id: 5, name: "سعود الشريم", server_url: "https://server7.mp3quran.net/shur" },
                { id: 6, name: "عبد الرحمن السديس", server_url: "https://server11.mp3quran.net/sds" },
                { id: 7, name: "سعد الغامدي", server_url: "https://server7.mp3quran.net/s_gmd" },
                { id: 8, name: "ياسر الدوسري", server_url: "https://server11.mp3quran.net/yasser" },
                { id: 9, name: "إسلام صبحي", server_url: "https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem" },
                { id: 10, name: "إسلام صابر", server_url: "https://server8.mp3quran.net/saber" }
              ]);
          }
        } catch (e) {
          console.error("Error loading settings", e);
        }
        setIsLoading(false);
      }
      load();
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000') {
      setAuthenticated(true);
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const saveToFirebase = async () => {
    setIsLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        islamic_books: books,
        prophetic_herbs_books: herbs,
        islamic_shorts: shorts,
        surah_reciters: surahReciters
      });
      alert('تم الحفظ بنجاح لجميع المستخدمين لحظياً!');
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء الحفظ');
    }
    setIsLoading(false);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50 rounded-t-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2">إعدادات الإدارة</h2>
          <button onClick={onClose} className="p-2 bg-gray-200 dark:bg-slate-700 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {!authenticated ? (
            <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 text-center">
              <Lock className="w-16 h-16 text-amber-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-6">الرجاء إدخال كلمة المرور</h3>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-100 dark:bg-slate-800 p-4 rounded-xl text-center text-2xl tracking-widest outline-none border focus:border-amber-500"
                placeholder="****"
                autoFocus
              />
              <button type="submit" className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl">
                دخول
              </button>
            </form>
          ) : (
            <div className="space-y-10">
              {/* Surah Reciters Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-amber-600">قراء سور القرآن الكريم (صوتيات mp3)</h3>
                  <button onClick={() => setSurahReciters([{id: Date.now(), name: 'اسم القارئ', server_url: ''}, ...surahReciters])} className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg">
                    <Plus className="w-4 h-4"/> إضافة
                  </button>
                </div>
                <div className="space-y-4">
                  {surahReciters.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" placeholder="اسم القارئ" value={item.name} onChange={e => { const n = [...surahReciters]; n[idx].name = e.target.value; setSurahReciters(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" dir="ltr" placeholder="رابط السيرفر (ينتهي بـ /)" value={item.server_url} onChange={e => { const n = [...surahReciters]; n[idx].server_url = e.target.value; setSurahReciters(n); }} />
                      <button onClick={() => setSurahReciters(surahReciters.filter(s => s.id !== item.id))} className="text-red-500 justify-self-start col-span-1 md:col-span-2"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Short / Reels Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-amber-600">ريلز إسلامية (الروابط)</h3>
                  <button onClick={() => setShorts([{id: Date.now(), title: 'عنوان', speaker: 'الشيخ', category: 'تصنيف', audio_url: '', thumbnail_url: ''}, ...shorts])} className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg">
                    <Plus className="w-4 h-4"/> إضافة
                  </button>
                </div>
                <div className="space-y-4">
                  {shorts.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" placeholder="العنوان" value={item.title} onChange={e => { const n = [...shorts]; n[idx].title = e.target.value; setShorts(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" dir="ltr" placeholder="رابط المقطع الصوتي mp3" value={item.audio_url} onChange={e => { const n = [...shorts]; n[idx].audio_url = e.target.value; setShorts(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" placeholder="الشيخ" value={item.speaker} onChange={e => { const n = [...shorts]; n[idx].speaker = e.target.value; setShorts(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" dir="ltr" placeholder="رابط صورة الغلاف" value={item.thumbnail_url} onChange={e => { const n = [...shorts]; n[idx].thumbnail_url = e.target.value; setShorts(n); }} />
                      <button onClick={() => setShorts(shorts.filter(s => s.id !== item.id))} className="text-red-500 justify-self-start"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Books & Tafsir */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-amber-600">المكتبة الإسلامية</h3>
                  <button onClick={() => setBooks([{id: Date.now(), title: 'اسم الكتاب', author: 'المؤلف', desc: 'نبذة عن الكتاب', url: ''}, ...books])} className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg">
                    <Plus className="w-4 h-4"/> إضافة
                  </button>
                </div>
                <div className="space-y-4">
                  {books.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" placeholder="اسم الكتاب" value={item.title} onChange={e => { const n = [...books]; n[idx].title = e.target.value; setBooks(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" dir="ltr" placeholder="رابط التحميل المباشر PDF" value={item.url} onChange={e => { const n = [...books]; n[idx].url = e.target.value; setBooks(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" placeholder="المؤلف" value={item.author} onChange={e => { const n = [...books]; n[idx].author = e.target.value; setBooks(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" placeholder="نبذة" value={item.desc} onChange={e => { const n = [...books]; n[idx].desc = e.target.value; setBooks(n); }} />
                      <button onClick={() => setBooks(books.filter(s => s.id !== item.id))} className="text-red-500 justify-self-start"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Herbs */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-amber-600">موسوعة الأعشاب</h3>
                  <button onClick={() => setHerbs([{id: Date.now(), title: 'اسم الكتاب', author: 'المؤلف', desc: 'نبذة', url: ''}, ...herbs])} className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg">
                    <Plus className="w-4 h-4"/> إضافة
                  </button>
                </div>
                <div className="space-y-4">
                  {herbs.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" placeholder="اسم العشبة/الكتاب" value={item.title} onChange={e => { const n = [...herbs]; n[idx].title = e.target.value; setHerbs(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" dir="ltr" placeholder="رابط التحميل" value={item.url} onChange={e => { const n = [...herbs]; n[idx].url = e.target.value; setHerbs(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" placeholder="المؤلف" value={item.author} onChange={e => { const n = [...herbs]; n[idx].author = e.target.value; setHerbs(n); }} />
                      <input className="bg-gray-50 dark:bg-slate-800 p-2 rounded" placeholder="نبذة" value={item.desc} onChange={e => { const n = [...herbs]; n[idx].desc = e.target.value; setHerbs(n); }} />
                      <button onClick={() => setHerbs(herbs.filter(s => s.id !== item.id))} className="text-red-500 justify-self-start"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {authenticated && (
           <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/80 rounded-b-2xl flex justify-end gap-4 items-center">
             {isLoading && <span className="text-gray-500">جاري التحميل...</span>}
             <button disabled={isLoading} onClick={saveToFirebase} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-transform hover:scale-105 disabled:opacity-50">
               <Save className="w-5 h-5" /> حفظ ونشر التعديلات
             </button>
           </div>
        )}
      </motion.div>
    </div>
  );
}
