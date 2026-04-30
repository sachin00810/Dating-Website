import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Heart, Shield, Sparkles } from 'lucide-react';
import { OnboardingModal } from '../components/OnboardingModal';
import { useStore } from '../store/useStore';

export const Home = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { userProfile, setUserProfile } = useStore();

  const handleStartChat = () => {
    if (!userProfile) {
      setShowOnboarding(true);
    } else {
      navigate('/chat');
    }
  };

  const handleOnboardingSubmit = (data) => {
    // Commit 5 will hook this up to Django.
    setUserProfile(data);
    setShowOnboarding(false);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-rose-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-3xl w-full">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Match</span> & Chat
        </h1>
        <p className="text-xl text-gray-400 mb-12 font-medium">
          Connect instantly with real people nearby.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 text-left">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
            <Video className="w-8 h-8 text-rose-500 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Instant Video</h3>
            <p className="text-gray-400 text-sm">Jump straight into high-quality, low-latency video chats.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Smart Matching</h3>
            <p className="text-gray-400 text-sm">Find users nearby with our optimized matchmaking queue.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
            <Shield className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Secure & Private</h3>
            <p className="text-gray-400 text-sm">End-to-end encrypted WebRTC streams.</p>
          </div>
        </div>

        <button 
          onClick={handleStartChat}
          className="group relative px-12 py-5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 transition-all rounded-full font-bold text-xl flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_60px_rgba(244,63,94,0.5)] hover:scale-105 duration-300 mx-auto overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <Heart className="w-6 h-6 relative z-10" />
          <span className="relative z-10 text-white drop-shadow-md">Live Video Chat</span>
        </button>
      </div>

      {showOnboarding && (
        <OnboardingModal 
          onSubmit={handleOnboardingSubmit} 
          onClose={() => setShowOnboarding(false)} 
        />
      )}
    </div>
  );
};
