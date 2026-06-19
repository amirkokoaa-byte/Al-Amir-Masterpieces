export const AZKAR_LIST = [
  { text: "سبحان الله وبحمده، سبحان الله العظيم", audio: "" },
  { text: "اللهم صل وسلم على نبينا محمد", audio: "" },
  { text: "أستغفر الله العظيم وأتوب إليه", audio: "" },
  { text: "لا إله إلا الله وحده لا شريك له", audio: "" },
  { text: "لا حول ولا قوة إلا بالله", audio: "" }
];

export function speakZikr(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    // optionally find an arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arVoice) utterance.voice = arVoice;
    
    window.speechSynthesis.speak(utterance);
  }
}
