"use client";

import { useState, useEffect } from "react";
import translations from "@/data/translations.json";
import ornamentsData from "@/data/ornaments.json";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from "recharts";
import { Upload, Book, ChartBar, Languages, Info, ArrowUpRight } from "lucide-react";

export default function SyrlyOyu() {
  const [lang, setLang] = useState("kz");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const t = translations[lang];

  // Survey Data for Charts
  const pieData = [
    { name: lang === 'ru' ? 'Не знают' : lang === 'kz' ? 'Білмейді' : 'Unknown', value: 59.5 },
    { name: lang === 'ru' ? 'Знают' : lang === 'kz' ? 'Біледі' : 'Known', value: 40.5 },
  ];
  
  const barData = [
    { name: 'Түйе табан', value: 45.2 },
    { name: 'Қошқар мүйіз', value: 42.9 },
    { name: 'Құс қанаты', value: 35.7 },
  ];

  const COLORS = ["#cc0000", "#00afca"];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => setImage(f.target.result);
      reader.readAsDataURL(file);
    }
  };

  const recognizePattern = async () => {
    if (!image) return alert("Please upload an image first!");
    setLoading(true);
    setRecognitionResult(null);

    try {
      const response = await fetch("/api/recognize", {
        method: "POST",
        body: JSON.stringify({ image: image.split(",")[1], lang: lang }),
      });
      const data = await response.json();
      setRecognitionResult(data);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen pb-20">
      <div className="ornament-bg" />
      
      {/* Navigation */}
      <nav className="container py-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
          <span className="text-2xl font-bold gold-text uppercase tracking-widest">{t.title}</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="lang-toggle hidden md:flex">
            {["kz", "ru", "en"].map((l) => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`lang-btn ${lang === l ? "active" : ""}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Languages size={18} />
            <span className="hidden sm:inline">Portal</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container text-center py-20 fade-in">
        <h2 className="text-xl text-turquoise font-medium mb-4 tracking-[0.2em]">{t.subtitle}</h2>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 max-w-4xl mx-auto leading-tight">
          {t.hero_desc.split(".")[0]}.
        </h1>
        <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
          {t.hero_desc.split(".")[1]}.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary px-10 py-5 text-lg">{t.button_learn}</button>
          <button className="bg-white border-2 border-gold text-gold-dark font-bold px-10 py-5 rounded-xl hover:bg-gold-light transition-all">
            {t.button_recognize}
          </button>
        </div>
      </section>

      {/* Encyclopedia - MAIN SECTION */}
      <section className="container py-20">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Book className="text-gold" size={32} />
            <h2 className="text-3xl font-bold">{t.nav_encyclopedia}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ornamentsData.map((item) => (
            <div key={item.id} className="glass-card p-8 group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Info size={80} />
              </div>
              <span className="text-xs font-bold text-turquoise uppercase mb-2 block tracking-widest">
                {item.category}
              </span>
              <h3 className="text-2xl font-bold mb-4">{item[`name_${lang}`] || item.name_kz}</h3>
              <p className="text-gray-600 line-clamp-3 mb-6">
                {item[`meaning_${lang}`] || item.meaning_kz}
              </p>
              <div className="flex items-center text-gold font-bold gap-2">
                {lang === 'en' ? 'Learn More' : lang === 'ru' ? 'Подробнее' : 'Толығырақ'}
                <ArrowUpRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Recognition - INTERACTIVE ADDITION */}
      <section className="container py-20">
        <div className="glass-card p-10 md:p-20 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-turquoise/10 rounded-full blur-3xl opacity-50" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 flex items-center gap-4">
                <Upload className="text-turquoise" /> {t.recognize_title}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {t.recognize_desc}
              </p>
              
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-turquoise transition-colors cursor-pointer group bg-white/50" onClick={() => document.getElementById('file-upload').click()}>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
                {image ? (
                  <img src={image} className="max-h-64 mx-auto rounded-xl shadow-lg" alt="Upload" />
                ) : (
                  <div className="py-10">
                    <div className="w-16 h-16 bg-turquoise/10 text-turquoise rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={30} />
                    </div>
                    <p className="font-medium text-gray-500 italic">Drag and drop or click to upload</p>
                  </div>
                )}
              </div>

              <button 
                onClick={recognizePattern}
                disabled={loading}
                className={`w-full mt-8 py-5 rounded-2xl font-bold text-xl transition-all ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}
              >
                {loading ? (lang === 'en' ? 'Analyzing...' : 'Талдау жүруде...') : t.button_recognize}
              </button>
            </div>

            <div className={`glass-card p-10 min-h-[400px] flex flex-col justify-center border-2 ${recognitionResult ? 'border-gold shadow-2xl scale-[1.05]' : 'border-transparent'}`}>
              {!recognitionResult ? (
                <div className="text-center opacity-30">
                  <div className="w-20 h-20 border-4 border-gray-200 rounded-full mx-auto mb-6 border-t-gold animate-spin-slow" />
                  <p className="text-xl italic">{lang === 'en' ? 'AI Result will appear here' : 'AI нәтижесі осында пайда болады'}</p>
                </div>
              ) : (
                <div className="fade-in">
                  <div className="bg-gold/10 inline-block px-4 py-1 rounded-full text-gold-dark font-bold text-sm mb-6 uppercase tracking-widest">
                    AI Gemini 2.5 Flash
                  </div>
                  <h3 className="text-4xl font-bold mb-2 text-turquoise">{recognitionResult.name_kz}</h3>
                  <p className="text-2xl text-gray-400 mb-8 italic">{recognitionResult.name_ru || recognitionResult.name_en}</p>
                  
                  <div className="space-y-6 text-lg leading-relaxed">
                    <div>
                      <span className="font-bold border-b-2 border-gold block mb-2">{lang === 'en' ? 'Meaning' : 'Мағынасы'}</span>
                      <p>{recognitionResult[`meaning_${lang}`] || recognitionResult.meaning_ru}</p>
                    </div>
                    <div>
                      <span className="font-bold border-b-2 border-gold block mb-2">{lang === 'en' ? 'Traditional Usage' : 'Қолдану аясы'}</span>
                      <p>{recognitionResult.usage || recognitionResult.usage_ru}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Research Section */}
      <section className="container py-20 pb-40">
        <div className="flex items-center gap-4 mb-12">
          <ChartBar className="text-gold" size={32} />
          <h2 className="text-3xl font-bold">{t.survey_title}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="glass-card p-10">
            <h3 className="text-xl font-bold mb-8 text-center">{pieData[0].name} vs {pieData[1].name}</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-8 text-center text-red-600 font-bold text-lg italic">
              «59.5% {lang === 'ru' ? 'не знают символическое значение орнаментов' : lang === 'kz' ? 'орнаменттердің символдық мәнін білмейді' : 'do not know the symbolic meaning'}»
            </p>
          </div>

          <div className="glass-card p-10">
            <h3 className="text-xl font-bold mb-8 text-center">{lang === 'ru' ? 'Узнаваемость узоров' : 'Орнаменттердің танылуы'}</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f5ba45" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-8 text-center text-gray-500">
              {lang === 'ru' ? 'Данные на основе 42 ответов вашего исследования.' : 'Сіздің зерттеуіңіздің 42 жауабына негізделген деректер.'}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container border-t border-gray-200 py-10 text-center text-gray-400">
        <p>{t.footer}</p>
      </footer>
    </main>
  );
}
