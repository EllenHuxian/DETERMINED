
import React, { useState, useEffect } from 'react';
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
  Zap 
} from 'lucide-react';

const App = () => {
  const [bounty, setBounty] = useState(100);
  const [day, setDay] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempter, setTempter] = useState('');
  const [penalties, setPenalties] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

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

  const handlePenalty = (e) => {
    e.preventDefault();
    if (!tempter) return;

    setIsProcessing(true);
    
    // Simulate API call/Logic delay
    setTimeout(() => {
      setBounty(prev => prev + 10);
      setPenalties([{ name: tempter, amount: 10, date: 'Just now' }, ...penalties]);
      setTempter('');
      setIsProcessing(false);
      setIsModalOpen(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Mobile Status Bar Simulation */}
      <div className="h-10 flex justify-between items-center px-8 pt-4 opacity-50">
        <span className="text-xs font-bold">9:41</span>
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
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Active Pot</span>
              <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <Zap size={10} fill="currentColor" /> LIVE
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-500">$</span>
              <span className="text-7xl font-black tracking-tighter text-white">
                {bounty}
              </span>
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
        <section className="mb-8">
          <div className="flex justify-between items-end mb-3 px-1">
            <div>
              <h2 className="text-lg font-bold">30 Days: No Caffeine</h2>
              <p className="text-xs text-slate-500">Target: $100.00 Payout</p>
            </div>
            <div className="text-right">
              <span className="text-orange-500 flex items-center gap-1 text-sm font-black italic">
                <Flame size={16} fill="currentColor" /> DAY {day}/30
              </span>
            </div>
          </div>
          
          <div className="h-4 w-full bg-white/5 rounded-full p-1 border border-white/5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-700 ease-out"
              style={{ width: `${(day/30)*100}%` }}
            ></div>
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
              penalties.map((p, idx) => (
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
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/60 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center px-6">
        <Target className="text-purple-500" size={24} />
        <ShieldCheck className="text-slate-600" size={24} />
        <Plus className="bg-white text-black rounded-xl p-1" size={32} />
        <Zap className="text-slate-600" size={24} />
        <User className="text-slate-600" size={24} />
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
    </div>
  );
};

export default App;
