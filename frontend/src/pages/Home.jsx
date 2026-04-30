import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Heart, Shield, Sparkles, Globe, Zap, MessageCircle, ChevronRight, Star } from 'lucide-react';
import { OnboardingModal } from '../components/OnboardingModal';
import { useStore } from '../store/useStore';
import { API_BASE_URL } from '../lib/config';

export const Home = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { userProfile, setUserProfile } = useStore();
  const [userCount, setUserCount] = useState(143847);

  // Animated user count ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStartChat = () => {
    if (!userProfile) {
      setShowOnboarding(true);
    } else {
      navigate('/chat');
    }
  };

  const handleOnboardingSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profiles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          age: parseInt(data.age, 10),
          address: data.address,
          preferred_gender: data.preferredGender
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const savedProfile = await response.json();
      setUserProfile(savedProfile);
      setShowOnboarding(false);
      navigate('/chat');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('There was an error saving your profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-rose-500/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-rose-500/5 to-indigo-500/5 rounded-full blur-3xl" />
        
        {/* Floating Hearts */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-500/10 animate-bounce"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`,
              fontSize: `${18 + i * 4}px`,
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Mini Nav */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-black tracking-tight text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Match</span>
          <span className="text-gray-300 font-medium"> & Chat</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">
              <span className="text-white font-bold">{userCount.toLocaleString()}</span> online
            </span>
          </div>
          {userProfile && (
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg"
            >
              {userProfile.name?.[0]?.toUpperCase() || 'U'}
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="text-center max-w-4xl w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Instant connections, zero waiting</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
            Meet People<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400">Face to Face</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
            The next generation of real-time dating. Video chat with real people nearby — no catfishing, no games, just genuine connections.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button 
              onClick={handleStartChat}
              className="group relative px-10 py-5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 transition-all rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_60px_rgba(244,63,94,0.5)] hover:scale-105 duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Video className="w-6 h-6 relative z-10" />
              <span className="relative z-10 text-white drop-shadow-md">Start Video Chat</span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={handleStartChat}
              className="group px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 duration-300"
            >
              <Heart className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Browse Matches</span>
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 text-left">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-6 rounded-2xl hover:bg-white/[0.06] transition-all duration-500 group">
              <Video className="w-7 h-7 text-rose-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold mb-2">HD Video</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Crystal clear WebRTC streams with adaptive quality.</p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-6 rounded-2xl hover:bg-white/[0.06] transition-all duration-500 group">
              <Sparkles className="w-7 h-7 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold mb-2">Smart Match</h3>
              <p className="text-gray-500 text-sm leading-relaxed">AI-powered pairing based on preferences and location.</p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-6 rounded-2xl hover:bg-white/[0.06] transition-all duration-500 group">
              <MessageCircle className="w-7 h-7 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold mb-2">Live Chat</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Text alongside video with emojis and reactions.</p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] p-6 rounded-2xl hover:bg-white/[0.06] transition-all duration-500 group">
              <Shield className="w-7 h-7 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold mb-2">Verified Safe</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Report, block, and end-to-end encryption built in.</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-white">4.8</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">User Rating</span>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-white">2M+</span>
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 font-medium">Global Users</span>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-white">50ms</span>
              <Zap className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 font-medium">Avg Latency</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© 2026 Match & Chat. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Terms</a>
            <a href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Safety</a>
          </div>
        </div>
      </footer>

      {showOnboarding && (
        <OnboardingModal 
          onSubmit={handleOnboardingSubmit} 
          onClose={() => setShowOnboarding(false)} 
        />
      )}
    </div>
  );
};
