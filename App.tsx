
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Trophy, 
  Flame, 
  AlertCircle, 
  Send, 
  Plus, 
  ChevronRight, 
  Target, 
  ShieldCheck, 
  User, 
  Zap,
  Wallet,
  Check,
  Calendar as CalendarIcon
} from 'lucide-react';

const App = () => {
  const [bounty, setBounty] = useState(100);
  const [day, setDay] = useState(12);
  const [targetDays] = useState(30);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempter, setTempter] = useState('');
  const [penalties, setPenalties] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  
  // Check-in state: Array of dates that have been checked in
  const [checkedInDays, setCheckedInDays] = useState<string[]>(() => {
    // Mocking some previous check-ins for visual effect
    const dates = [];
    const today = new Date();
    for (let i = 1; i < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate secured amount: Current progress percentage of the total bounty
  const progressPercentage = (day / targetDays);
  const securedAmount = (bounty * progressPercentage).toFixed(2);

  // Generate Tired Cat Avatar
  useEffect(() => {
    const cachedAvatar = localStorage.getItem('determined_user_avatar');
    if (cachedAvatar) {
      setAvatarUrl(cachedAvatar);
      return;
    }

    const generateAvatar = async () => {
      setIsGeneratingAvatar(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: 'A relatable meme style cat that looks extremely tired, with heavy dark under-eye circles, looking straight at the camera, digital illustration, simple clean background, expressive and humorous.',
              },
            ],
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const fullUrl = `data:image/png;base64,${base64Data}`;
            setAvatarUrl(fullUrl);
            localStorage.setItem('determined_user_avatar', fullUrl);
            break;
          }
        }
      } catch (error) {
        console.error("Failed to generate avatar:", error);
      } finally {
        setIsGeneratingAvatar(false);
      }
    };

    generateAvatar();
  }, []);

  // Calendar logic: Generate last 14 days to allow scrolling
  const calendarDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: i === 0
    };
  });

  const handleCheckIn = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (checkedInDays.includes(todayStr)) return;

    setCheckedInDays(prev => [...prev, todayStr]);
    setDay(prev => prev + 1);
    
    // Play subtle haptic-like effect or visual feedback
    const btn = document.getElementById('check-in-main-btn');
    btn?.classList.add('scale-90');
    setTimeout(() => btn?.classList.remove('scale-90'), 150);
  };

  const handlePenalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempter) return;

    setIsProcessing(true);
    
    setTimeout(() => {
      setBounty(prev => prev + 10);
      setPenalties(prev => [{ name: tempter, amount: 10, date: 'Just now' } as any, ...prev]);
      setTempter('');
      setIsProcessing(false);
      setIsModalOpen(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Mobile Status Bar Simulation */}
      <div className="h-10 flex justify-between items-center px-8 pt-4 opacity-50">
        <span className="text-xs font-bold text-white">9:41</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-2.5 bg-white/20 rounded-sm"></div>
          <div className="w-4 h-2.5 bg-white/20 rounded-sm"></div>
          <div className="w-6 h-2.5 bg-white/60 rounded-sm"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 pb-24">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Trophy className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              DETERMINED
            </h1>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-all hover:border-purple-500/50">
            {isGeneratingAvatar ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-slate-400" />
            )}
          </button>
        </header>

        {/* Main Bounty Display */}
        <section className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#0f0f12] border border-white/10 rounded-[2rem] p-8 overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">YOUR GOAL: NO CAFFINE</span>
              <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <Zap size={10} fill="currentColor" /> LIVE
              </div>
            </div>

            <div className="flex items-baseline gap-6 mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-500 leading-none">$</span>
                <span className="text-7xl font-black tracking-tighter text-white leading-none">
                  {bounty}
                </span>
              </div>
              
              <div className="relative flex items-baseline gap-0.5 opacity-90">
                <span className="absolute bottom-full mb-1 left-0 text-[10px] font-bold uppercase tracking-widest text-green-500/80 whitespace-nowrap">Secured</span>
                <span className="text-sm font-bold text-green-500/60 leading-none">$</span>
                <span className="text-3xl font-black text-green-400 tracking-tight leading-none">
                  {securedAmount}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0f0f12] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                <span className="text-slate-200">3 supporters</span> have funded this quest
              </p>
            </div>
          </div>
        </section>

        {/* Challenge Progress */}
        <section className="mb-6 p-6 bg-white/5 border border-white/10 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={48} />
          </div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h2 className="text-lg font-bold">No Caffeine</h2>
            </div>
            <div className="text-right">
              <span className="text-orange-500 flex items-center gap-1 text-sm font-black italic">
                <Flame size={16} fill="currentColor" /> Day {day} of {targetDays}
              </span>
            </div>
          </div>

          <div className="h-2 w-full bg-white/5 rounded-full mb-6 border border-white/5 relative overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage * 100}%` }}
            ></div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-end">
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-green-500 mb-1">Status</p>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-300 tracking-tight uppercase">Partial Payout Secured</span>
               </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Risked Balance</p>
              <p className="text-2xl font-black text-slate-400 tracking-tight">${(bounty - parseFloat(securedAmount)).toFixed(2)}</p>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <CalendarIcon size={12} className="text-purple-500" /> RESILIENCE LOG
            </h3>
            <span className="text-[10px] text-slate-600 italic">Swipe for history</span>
          </div>
          <div 
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide flex-row-reverse"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {calendarDays.map((d) => {
              const isChecked = checkedInDays.includes(d.dateStr);
              return (
                <div 
                  key={d.dateStr}
                  className={`flex-shrink-0 w-14 h-20 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    d.isToday 
                      ? 'border-purple-500/50 bg-purple-500/10' 
                      : 'border-white/5 bg-white/5'
                  } ${isChecked ? 'ring-1 ring-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : ''}`}
                >
                  <span className={`text-[10px] font-bold uppercase mb-1 ${isChecked ? 'text-green-500' : 'text-slate-500'}`}>
                    {d.dayName}
                  </span>
                  <span className={`text-lg font-black ${isChecked ? 'text-white' : 'text-slate-400'}`}>
                    {d.dayNum}
                  </span>
                  {isChecked && (
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]"></div>
                  )}
                  {d.isToday && !isChecked && (
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* The Magic Moment Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full relative group mb-8 active:scale-95 transition-transform"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition"></div>
          <div className="relative bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-5 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                <AlertCircle size={28} />
              </div>
              <div>
                <h3 className="font-bold text-red-100 uppercase tracking-tight text-sm">Someone Tempted Me</h3>
                <p className="text-xs text-red-300/60">Tap to charge them $10.00</p>
              </div>
            </div>
            <ChevronRight className="text-red-500/50" />
          </div>
        </button>

        {/* Recent Penalty Feed */}
        <section>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 px-1">Live Activity</h4>
          <div className="space-y-3">
            {penalties.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-xs text-slate-600 font-medium">No penalties yet. Stay strong.</p>
              </div>
            ) : (
              penalties.map((p: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 animate-in slide-in-from-right-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                      <Plus size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{p.name} was caught!</p>
                      <p className="text-[10px] text-slate-500">{p.date}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-green-400">+$10.00</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Navigation Simulation */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-black/60 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center px-6 pb-4">
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <Target className="text-purple-500 group-hover:scale-110 transition-transform" size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter text-purple-500/60">Quest</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <ShieldCheck className="text-slate-600 group-hover:text-slate-400 transition-colors" size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-600">Vault</span>
        </div>

        {/* Main Check-in Action Button */}
        <div className="relative -mt-12 group">
          <div className={`absolute -inset-2 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500 ${checkedInDays.includes(new Date().toISOString().split('T')[0]) ? 'hidden' : 'animate-pulse'}`}></div>
          <button 
            id="check-in-main-btn"
            onClick={handleCheckIn}
            className={`relative w-18 h-18 rounded-full flex flex-col items-center justify-center border-4 border-[#050505] transition-all duration-300 transform active:scale-75 ${
              checkedInDays.includes(new Date().toISOString().split('T')[0])
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'bg-white text-black shadow-xl shadow-white/10'
            }`}
          >
            {checkedInDays.includes(new Date().toISOString().split('T')[0]) ? (
              <>
                <Check size={32} strokeWidth={3} />
                <span className="text-[8px] font-black uppercase mt-0.5">Done</span>
              </>
            ) : (
              <>
                <Plus size={32} strokeWidth={3} />
                <span className="text-[8px] font-black uppercase mt-0.5">Check</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <Zap className="text-slate-600 group-hover:text-slate-400 transition-colors" size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-600">Feed</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <User className="text-slate-600 group-hover:text-slate-400 transition-colors" size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-600">Profile</span>
        </div>
      </nav>

      {/* Temptation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#121214] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl -z-10"></div>
             
             <h3 className="text-2xl font-black tracking-tight mb-2">Expose the Tempter</h3>
             <p className="text-slate-400 text-sm mb-8 leading-relaxed">
               Did someone try to break your streak? Enter their handle to request a <span className="text-red-400 font-bold">$10.00 penalty</span>.
             </p>

             <form onSubmit={handlePenalty}>
               <div className="relative mb-6">
                 <input 
                  autoFocus
                  type="text" 
                  placeholder="@username or phone"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-slate-600"
                  value={tempter}
                  onChange={(e) => setTempter(e.target.value)}
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 italic text-xs">😈</div>
               </div>

               <button 
                type="submit"
                disabled={!tempter || isProcessing}
                className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                 {isProcessing ? (
                   <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                 ) : (
                   <>
                    <Send size={18} />
                    SEND PENALTY REQUEST
                   </>
                 )}
               </button>

               <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-4 py-2 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
               >
                 I changed my mind
               </button>
             </form>
          </div>
        </div>
      )}
      
      {/* Global Style for hiding scrollbars */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .w-18 { width: 4.5rem; }
        .h-18 { height: 4.5rem; }
      `}</style>
    </div>
  );
};

export default App;
