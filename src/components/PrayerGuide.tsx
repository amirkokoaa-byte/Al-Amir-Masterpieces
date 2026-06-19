import React, { useState } from 'react';
import { Compass, Clock, CheckCircle2, Droplets, Info } from 'lucide-react';

type PrayerCategory = 'المفروضة' | 'السنن الرواتب' | 'المناسبات' | 'الحاجة' | 'الوقتية' | 'الأحوال';

interface PrayerFormat {
  name: string;
  type: string;
  rakats: string;
  time: string;
  how_to_pray: string;
  benefit: string;
  category: PrayerCategory;
}

export function PrayerGuide() {
  const [activeFilter, setActiveFilter] = useState<PrayerCategory | 'الكل'>('الكل');

  const allPrayers: PrayerFormat[] = [
    // المفروضة
    { category: 'المفروضة', name: 'الفجر', type: 'فرض عين', rakats: 'ركعتان', time: 'من طلوع الفجر الصادق إلى شروق الشمس', how_to_pray: 'ركعتان جهريتان يقرأ فيهما الفاتحة وما تيسر، فيهما ركوع واحد وسجودان في كل ركعة، وتشهد أخير تسلم بعده.', benefit: 'من صلاها في جماعة فكأنما قام الليل كله، وهي في ذمة الله.' },
    { category: 'المفروضة', name: 'الظهر', type: 'فرض عين', rakats: '٤ ركعات', time: 'من زوال الشمس عن وسط السماء إلى أن يصير ظل الشيء مثله', how_to_pray: 'أربع ركعات سرية، يتشهد في الثانية، ويقرأ في الأوليين الفاتحة وسورة، وفي الأخيرتين الفاتحة فقط.', benefit: 'وقت تفتح فيه أبواب السماء.' },
    { category: 'المفروضة', name: 'العصر', type: 'فرض عين', rakats: '٤ ركعات', time: 'من خروج وقت الظهر إلى قبل غروب الشمس', how_to_pray: 'مثل الظهر تماماً (سرية، تشهدان).', benefit: 'الصلاة الوسطى التي أمر الله بالمحافظة عليها.' },
    { category: 'المفروضة', name: 'المغرب', type: 'فرض عين', rakats: '٣ ركعات', time: 'من غروب الشمس إلى مغيب الشفق الأحمر', how_to_pray: 'ركعتان جهريتان، ثم تشهد أوسط، ثم ركعة ثالثة سرية بالفاتحة فقط، ثم تشهد أخير وتسليم.', benefit: 'صلاة الوتر في النهار وأداء شكر يومك.' },
    { category: 'المفروضة', name: 'العشاء', type: 'فرض عين', rakats: '٤ ركعات', time: 'من مغيب الشفق الأحمر إلى منتصف الليل', how_to_pray: 'الأوليان جهريتان، والأخيرتان سريتان بمثل صفة صلاة الظهر.', benefit: 'من صلاها في جماعة فكأنما قام نصف الليل.' },
    { category: 'المفروضة', name: 'صلاة الجمعة', type: 'فرض عين (للرجال)', rakats: 'ركعتان', time: 'وقت صلاة الظهر يوم الجمعة', how_to_pray: 'يسبقها خطبتان للمؤمنين، ثم تصلى ركعتين جهريتين بدلاً من الظهر.', benefit: 'كفارة لما بينها وبين الجمعة الأخرى، وخير يوم طلعت فيه الشمس.' },

    // السنن الرواتب
    { category: 'السنن الرواتب', name: 'سنة الفجر', type: 'سنة مؤكدة', rakats: 'ركعتان', time: 'قبل صلاة الفجر', how_to_pray: 'ركعتان خفيفتان يقرأ فيهما بـ (الكافرون) و (الإخلاص).', benefit: 'خير من الدنيا وما فيها.' },
    { category: 'السنن الرواتب', name: 'سنة الظهر', type: 'سنة مؤكدة', rakats: '٤ قبلها و ٢ بعدها', time: 'قبل وبعد صلاة الظهر', how_to_pray: 'تصلى مثنى مثنى، أربع قبل الفريضة وركعتين بعدها (أو 4 بعدها).', benefit: 'من حافظ على أربع قبل الظهر وأربع بعدها حرمه الله على النار.' },
    { category: 'السنن الرواتب', name: 'سنة المغرب', type: 'سنة مؤكدة', rakats: 'ركعتان', time: 'بعد صلاة المغرب مباشرة', how_to_pray: 'ركعتان سرية، ويستحب قراءة الكافرون والإخلاص.', benefit: 'تجبر النقص في الفريضة وتكتب من الرواتب (12 ركعة يبنى له بيت في الجنة).' },
    { category: 'السنن الرواتب', name: 'سنة العشاء', type: 'سنة مؤكدة', rakats: 'ركعتان', time: 'بعد صلاة العشاء وقبل الوتر', how_to_pray: 'ركعتان سرية.', benefit: 'جزء من السنن الرواتب التي يبنى لصاحبها بيت في الجنة.' },

    // المناسبات
    { category: 'المناسبات', name: 'صلاة العيدين', type: 'سنة مؤكدة / فرض كفاية', rakats: 'ركعتان', time: 'بعد شروق الشمس يوم العيد بارتفاع رمح', how_to_pray: 'ركعتان دون أذان ولا إقامة. يكبر في الأولى 7 تكبيرات، وفي الثانية 5 تكبيرات قبل الفاتحة. بعدها خطبة.', benefit: 'إظهار الفرح وشكر الله على إتمام العبادة.' },
    { category: 'المناسبات', name: 'صلاة الكسوف والخسوف', type: 'سنة مؤكدة', rakats: 'ركعتان', time: 'عند حدوث الكسوف للشمس أو الخسوف للقمر حتى تنجلي', how_to_pray: 'ركعتان جهريتان، في كل ركعة (قيامان وقراءتان وركوعان وسجودان)، تطول فيها القراءة.', benefit: 'التضرع لله ودفع البلاء والتذكير بقدرة الله.' },
    { category: 'المناسبات', name: 'صلاة الاستسقاء', type: 'سنة مؤكدة', rakats: 'ركعتان', time: 'عند الجدب وتأخر المطر', how_to_pray: 'تصلى كصلاة العيد، ركعتان يكبر في الأولى 7 وفي الثانية 5 تكبيرات، تعقبها خطبة ودعاء مع قلب الرداء.', benefit: 'الافتقار إلى الله وطلب السقيا والرحمة.' },

    // الحاجة
    { category: 'الحاجة', name: 'صلاة الاستخارة', type: 'سنة', rakats: 'ركعتان', time: 'في أي وقت غیر أوقات الكراهة عند الهم بالأمر', how_to_pray: 'ركعتان نافلة، ثم بعد السلام تدعو بدعاء الاستخارة المأثور (اللهم إني أستخيرك بعلمك...).', benefit: 'تفويض الأمر لله وتسليم الاختيار لرب العالمين وتيسير الخير.' },
    { category: 'الحاجة', name: 'صلاة قضاء الحاجة', type: 'نافلة', rakats: 'ركعتان', time: 'عند وجود حاجة دنيوية أو أخروية', how_to_pray: 'يحسن الوضوء ويصلي ركعتين، يثني على الله ويصلي على النبي، ثم يسأل الله حاجته.', benefit: 'اللجوء إلى الله في كل صغيرة وكبيرة وتفريج الكروب.' },
    { category: 'الحاجة', name: 'صلاة التوبة', type: 'نافلة', rakats: 'ركعتان', time: 'عقب الذنب مباشرة', how_to_pray: 'من أذنب ذنباً ثم تطهر وصلى ركعتين ثم استغفر الله، غفر له.', benefit: 'محو الخطايا وتجديد العهد مع الله.' },

    // الوقتية
    { category: 'الوقتية', name: 'صلاة الوتر', type: 'سنة مؤكدة', rakats: 'من ١ إلى ١١ ركعة', time: 'بعد العشاء لحين صلاة الفجر', how_to_pray: 'تختم به صلاة الليل. تصلى مثنى مثنى وتختم بركعة، ويسن فيها دعاء القنوت قبل أو بعد الركوع في الركعة الأخيرة.', benefit: 'إن الله وتر يحب الوتر، وهي من آكد السنن.' },
    { category: 'الوقتية', name: 'قيام الليل (التهجد)', type: 'سنة مؤكدة', rakats: 'مثنى مثنى', time: 'من بعد العشاء إلى الفجر (والثلث الأخير أفضله)', how_to_pray: 'تصلى ركعتين ركعتين يطال فيها القراءة والركوع والسجود وتختم بالوتر.', benefit: 'شرف المؤمن ودأب الصالحين ومستجاب فيه الدعاء.' },
    { category: 'الوقتية', name: 'صلاة الضحى', type: 'سنة مؤكدة', rakats: 'من ٢ إلى ٨ ركعات', time: 'من بعد شروق الشمس بثلث ساعة إلى قبيل الظهر', how_to_pray: 'تصلى مثنى مثنى (تسلم بعد كل ركعتين).', benefit: 'صلاة الأوابين، وتجزئ عن صدقة كل مفصل من الجسد.' },
    { category: 'الوقتية', name: 'صلاة التراويح', type: 'سنة مؤكدة', rakats: '١١ أو ٢٣ ركعة أو أكثر', time: 'في ليالي رمضان بعد صلاة العشاء', how_to_pray: 'تصلى ركعتين ركعتين في جماعة أو فرادى وتختم بالوتر.', benefit: 'من قام رمضان إيماناً واحتساباً غفر له ما تقدم من ذنبه.' },

    // الأحوال
    { category: 'الأحوال', name: 'تحية المسجد', type: 'سنة مؤكدة', rakats: 'ركعتان', time: 'عند دخول المسجد وقبل الجلوس', how_to_pray: 'يصلي ركعتين نافلة خفيفتين قبل أن يجلس.', benefit: 'إعطاء المسجد حقه وتوقيراً لبيت الله.' },
    { category: 'الأحوال', name: 'صلاة الجنازة', type: 'فرض كفاية', rakats: 'لا يوجد ركوع ولا سجود (٤ تكبيرات)', time: 'قبل دفن الميت', how_to_pray: 'تكبر وتقرأ الفاتحة، ثم الثانية وتصلي على النبي، ثم الثالثة وتدعو للميت، ثم الرابعة وتدعو للمسلمين وتسلم.', benefit: 'الشفاعة للميت ومواساة أهله وأجر قيراط من الأجر.' },
    { category: 'الأحوال', name: 'صلاة السفر (القصر والجمع)', type: 'رخصة مؤكدة', rakats: 'الرباعية تصبح ركعتين', time: 'في حالة السفر', how_to_pray: 'تقصر الظهر والعصر والعشاء إلى ركعتين، ويجوز جمع (الظهر مع العصر) و(المغرب مع العشاء) جمع تقديم أو تأخير.', benefit: 'تخفيف ومشقة وصدقة تصدق الله بها على المسافرين.' },
  ];

  const categories: (PrayerCategory | 'الكل')[] = ['الكل', 'المفروضة', 'السنن الرواتب', 'المناسبات', 'الحاجة', 'الوقتية', 'الأحوال'];

  const filteredPrayers = activeFilter === 'الكل' 
    ? allPrayers 
    : allPrayers.filter(p => p.category === activeFilter);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 pb-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <Compass className="text-blue-500 w-8 h-8" /> دليل الصلوات والطهور الشامل
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mt-3 font-medium">مرجعك المتكامل لكل ما يخص الصلوات وأحكام الوضوء والاغتسال</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Wudu Guide */}
        <div className="glass-panel p-8 glow-hover border border-gray-100/50 dark:border-slate-700/50 flex flex-col">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100 border-b border-gray-200 dark:border-slate-700 pb-3">
            <Droplets className="text-blue-500 w-6 h-6" /> طريقة الوضوء الصحيحة
          </h3>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300 font-medium">
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> النية في القلب، والبسملة: "بسم الله".</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> غسل الكفين ثلاث مرات المضمضة والاستنشاق والاستنثار ثلاث مرات بغرفة واحدة.</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> غسل الوجه (من منابت الشعر المعتاد إلى الذقن، ومن الأذن للأذن) ثلاث مرات.</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> غسل اليدين مع المرفقين (اليمنى ثم اليسرى) ثلاثاً.</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> مسح الرأس مرة واحدة (من الأمام للخلف والعودة)، مع مسح الأذنين.</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> غسل الرجلين مع الكعبين (اليمنى ثم اليسرى) ثلاثاً مع التخليل.</li>
            <li className="flex gap-3 items-start mt-4 bg-blue-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-blue-100 dark:border-slate-700">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> 
              <span><span className="font-bold">الدعاء:</span> "أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمدًا عبده ورسوله، اللهم اجعلني من التوابين واجعلني من المتطهرين".</span>
            </li>
          </ul>
        </div>

        {/* Ghusl Guide */}
        <div className="glass-panel p-8 glow-hover border border-gray-100/50 dark:border-slate-700/50 flex flex-col">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100 border-b border-gray-200 dark:border-slate-700 pb-3">
            <Droplets className="text-blue-500 w-6 h-6" /> كيفية الاغتسال من الجنابة
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 font-bold">الغسل المجزئ (نية وتعميم الجسد بالماء والمضمضة والاستنشاق)، وأما الغسل الكامل كفعل النبي ﷺ فهو:</p>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300 font-medium">
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> النية في القلب وتسمية الله (التسمية).</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> غسل اليدين ثلاث مرات.</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> غسل الفرج وإزالة ما به من أذى باليد اليسرى.</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> غسل اليدين بالصابون أو تخليلها بعد تنظيف الفرج.</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> الوضوء الكامل كوضوء الصلاة تماماً (ويمكن تأخير غسل القدمين لآخر الغسل).</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> سكب الماء على الرأس ثلاث مرات وتخليل أصول الشعر حتى يروى.</li>
            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> تعميم كامل الجسد بالماء، مبتدئاً بالشق الأيمن ثم الأيسر، مع فرك و دلك الجسد والاعتناء بأماكن الطيات.</li>
          </ul>
        </div>
      </div>

      <div className="pt-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
          <Clock className="text-blue-500 w-6 h-6" /> موسوعة الصلوات الشاملة
        </h3>
        
        {/* Filter Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                activeFilter === cat 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30 -translate-y-0.5' 
                : 'bg-white/40 dark:bg-slate-800/40 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Prayers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrayers.map((prayer, idx) => (
            <div key={idx} className="glass-panel p-6 glow-hover border border-gray-100/50 dark:border-slate-700/50 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{prayer.name}</h4>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20">
                  {prayer.type}
                </span>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div className="bg-white/40 dark:bg-slate-900/40 p-3 rounded-xl border border-transparent shadow-sm">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1 text-xs">عدد الركعات</span>
                    <span className="text-slate-900 dark:text-slate-100">{prayer.rakats}</span>
                  </div>
                  <div className="bg-white/40 dark:bg-slate-900/40 p-3 rounded-xl border border-transparent shadow-sm">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1 text-xs">وقت الأداء</span>
                    <span className="text-slate-900 dark:text-slate-100">{prayer.time}</span>
                  </div>
                </div>

                <div className="px-1">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1 text-xs font-bold">كيفية الصلاة:</span>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                    {prayer.how_to_pray}
                  </p>
                </div>

                <div className="px-1 pt-2 border-t border-gray-100 dark:border-slate-700/50">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1 text-xs font-bold flex items-center gap-1">
                    <Info className="w-3 h-3 text-blue-500" /> فضلها وثمرتها:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                    {prayer.benefit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
