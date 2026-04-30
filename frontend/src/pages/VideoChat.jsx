import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useWebRTC } from '../hooks/useWebRTC';
import { VideoPlayer } from '../components/VideoPlayer';
import { Video, VideoOff, PhoneOff, Search, Filter, Grid, MapPin, User } from 'lucide-react';

export const VideoChat = () => {
  const { localStream, remoteStream, matchStatus, connectionState } = useStore();
  const { startLocalStream, connectWebSocket, endCall } = useWebRTC();

  useEffect(() => {
    // Request camera as soon as we enter the page
    startLocalStream();
  }, [startLocalStream]);

  return (
    <div className="min-h-screen bg-[#111111] p-4 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 bg-[#222222] rounded-full mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-[#ff4b4b]">Match</span> & Chat
        </h1>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            connectionState === 'connected' ? 'bg-green-500' : 
            connectionState === 'connecting' ? 'bg-yellow-500' : 'bg-gray-500'
          }`} />
          <span className="text-sm font-medium text-gray-300 capitalize">{connectionState}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 mb-6">
        
        {/* Left Panel - Discovery */}
        <div className="flex-1 relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col p-6 min-h-[500px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 z-10">
            <h2 className="text-sm font-bold text-gray-400 tracking-wider">PROFILES NEARBY <span className="text-[#ff4b4b]">(ACTIVE)</span></h2>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Filter className="w-5 h-5 text-gray-400" /></button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Grid className="w-5 h-5 text-gray-400" /></button>
            </div>
          </div>

          {/* Profile Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 flex-1 auto-rows-fr z-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden relative group bg-white/5 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 blur-xl group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-2 left-2 w-12 h-2 bg-white/20 rounded-full blur-[1px]" />
                <div className="absolute bottom-2 left-16 w-6 h-2 bg-white/10 rounded-full blur-[1px]" />
              </div>
            ))}
          </div>

          {/* Central Overlay CTA */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            <div className="bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-[#ff4b4b]/30 shadow-[0_0_40px_rgba(255,75,75,0.3)]">
              <h2 className="text-lg font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">CONNECT WITH USERS</h2>
            </div>
          </div>
        </div>

        {/* Right Panel - Video Feed */}
        <div className="flex-1 relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl min-h-[500px] flex flex-col p-2">
          {/* Main Remote Video Container */}
          <div className="flex-1 relative overflow-hidden rounded-2xl bg-black/50 border border-white/5">
            <VideoPlayer stream={remoteStream} isLocal={false} />
            
            {/* Integrated Profile Card Overlay */}
            <div className="absolute bottom-4 left-4 right-28 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">Alex, 24 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" /></h3>
                <p className="text-gray-300 text-sm flex items-center gap-1"><MapPin className="w-4 h-4 text-[#ff4b4b]" /> Near You (2km)</p>
              </div>
            </div>
          </div>
          
          {/* Local Video - Floating overlay in the right panel */}
          <div className="w-32 h-48 absolute bottom-6 right-6 z-20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-xl border border-white/20 overflow-hidden bg-black">
            <VideoPlayer stream={localStream} isLocal={true} />
            {/* Persistent YOU tag */}
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
              <User className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white tracking-wider">YOU</span>
            </div>
          </div>
        </div>

      </main>

      {/* Controls */}
      <footer className="flex justify-center items-center gap-6 py-4">
        {matchStatus === 'idle' || matchStatus === 'searching' ? (
          <button 
            onClick={connectWebSocket}
            className="px-8 py-4 bg-[#ff4b4b] hover:bg-[#ff2d2d] transition-colors rounded-full font-bold text-lg flex items-center gap-3 shadow-[0_0_20px_rgba(255,75,75,0.4)]"
          >
            <Search className="w-6 h-6" />
            Find Match
          </button>
        ) : (
          <>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
              <Video className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={endCall}
              className="p-5 bg-red-600 hover:bg-red-500 rounded-full transition-colors shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>
          </>
        )}
      </footer>
    </div>
  );
};
