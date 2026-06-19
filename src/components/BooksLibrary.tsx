import React, { useState, useEffect } from 'react';
import { Book, Download } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function BooksLibrary() {
  const defaultBooks = [
    { id: 1, title: 'صحيح البخاري', author: 'الإمام البخاري', desc: 'الجامع المسند الصحيح المختصر من أمور رسول الله صلى الله عليه وسلم وسننه وأيامه', url: 'https://archive.org/download/waq10447/10447.pdf' },
    { id: 2, title: 'صحيح مسلم', author: 'الإمام مسلم', desc: 'المسند الصحيح المختصر بنقل العدل عن العدل إلى رسول الله صلى الله عليه وسلم', url: 'https://archive.org/download/FP35198/35198.pdf' },
    { id: 3, title: 'تفسير ابن كثير', author: 'ابن كثير', desc: 'تفسير القرآن العظيم', url: 'https://archive.org/download/TafseerIbnKatheer_201804/Tafseer_Ibn_Katheer.pdf' },
    { id: 4, title: 'تفسير الطبري', author: 'محمد بن جرير الطبري', desc: 'جامع البيان عن تأويل آي القرآن', url: 'https://archive.org/download/TafsirAlTabari_201811/Tafsir_Al_Tabari.pdf' },
    { id: 5, title: 'رياض الصالحين', author: 'الإمام النووي', desc: 'كتاب رياض الصالحين من كلام سيد المرسلين', url: 'https://archive.org/download/Riyad_Al_Salihin_Arabic/Riyad_Al_Salihin.pdf' },
    { id: 6, title: 'الرحيق المختوم', author: 'صفي الرحمن المباركفوري', desc: 'بحث في السيرة النبوية على صاحبها أفضل الصلاة والسلام', url: 'https://archive.org/download/Ar-raheeqAl-makhtoomtheSealedNectar/Ar-Raheeq-AlMakhtum.pdf' }
  ];

  const [booksState, setBooksState] = useState(defaultBooks);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists() && doc.data().islamic_books) {
        setBooksState(doc.data().islamic_books);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
          <Book className="text-amber-500 w-6 h-6" /> مكتبة الكتب والتفاسير والأحاديث النبوية
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2">مكتبة شاملة لتحميل الكتب مباشرة بصيغة PDF المعتمدة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {booksState.map(book => (
          <div key={book.id} className="glass-panel p-6 glow-hover flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 border border-amber-500/30">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{book.title}</h3>
                <span className="text-sm text-amber-600 dark:text-amber-500 font-medium">{book.author}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 leading-relaxed mb-6 font-medium">
              {book.desc}
            </p>
            <a 
              href={book.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-auto w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1"
            >
              <Download className="w-5 h-5" /> تحميل مباشر PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
