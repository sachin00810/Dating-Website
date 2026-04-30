import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useWebRTC } from '../hooks/useWebRTC';
import { VideoPlayer } from '../components/VideoPlayer';
import { ChatPanel } from '../components/ChatPanel';
import { Video, VideoOff, PhoneOff, Search, MapPin, User, Users, Mic, MicOff, SkipForward, ArrowLeft } from 'lucide-react';

export const VideoChat = () => {
  const navigate = useNavigate();
  const { localStream, remoteStream, matchStatus, connectionState, isMuted, isVideoOff, userProfile } = useStore();
  const { startLocalStream, connectWebSocket, endCall, toggleAudio, toggleVideo } = useWebRTC();

  const handleDisconnect = () => {
    endCall();
    navigate('/');
  };

  useEffect(() => {
    if (!userProfile) {
      navigate('/');
      return;
    }
    startLocalStream();
  }, [startLocalStream, userProfile, navigate]);

  return (
    <div className="h-screen bg-[#0a0b10] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-3 px-6 bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDisconnect}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Match</span>
            <span className="font-medium text-gray-400">& Chat</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wide">
              ONLINE: <span className="text-white font-bold">145K+</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/[0.06]">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
              connectionState === 'connected' ? 'bg-green-500 text-green-500' : 
              connectionState === 'connecting' ? 'bg-yellow-500 text-yellow-500 animate-pulse' : 'bg-gray-600 text-gray-600'
            }`} />
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{connectionState}</span>
          </div>

          {userProfile && (
            <button 
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs"
            >
              {userProfile.name?.[0]?.toUpperCase() || 'U'}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row gap-0 overflow-hidden">
        
        {/* Left Panel - Chat */}
        <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 bg-white/[0.02] border-r border-white/[0.06] flex flex-col overflow-hidden">
          <ChatPanel />
        </div>

        {/* Right Panel - Video Feed */}
        <div className="flex-1 relative flex flex-col p-3 overflow-hidden">
          {/* Main Remote Video */}
          <div className="flex-1 relative overflow-hidden rounded-2xl bg-black/50 border border-white/[0.06]">
            <VideoPlayer stream={remoteStream} isLocal={false} />
            
            {/* Partner Profile Overlay */}
            {matchStatus === 'matched' && (
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-xl z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Alex, 24
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                </h3>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" /> Near You
                </p>
              </div>
            )}

            {/* Connection State Overlay */}
            {matchStatus !== 'matched' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                {matchStatus === 'searching' ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-2 border-rose-500/30 animate-ping absolute inset-0" />
                      <div className="w-20 h-20 rounded-full border-2 border-rose-500/50 animate-pulse flex items-center justify-center">
                        <Search className="w-8 h-8 text-rose-500" />
                      </div>
                    </div>
                    <p className="text-white font-bold text-lg tracking-wider">SEARCHING...</p>
                    <p className="text-gray-400 text-sm">Looking for someone nearby</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 font-medium">Press a button below to connect</p>
                  </div>
                )}
              </div>
            )}

            {/* Media Control Bar — always visible when we have a stream */}
            {localStream && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl z-30">
                <button 
                  onClick={toggleAudio}
                  className={`p-2.5 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                
                <button 
                  onClick={toggleVideo}
                  className={`p-2.5 rounded-full transition-all ${isVideoOff ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>
                
                <div className="w-px h-6 bg-white/10" />

                <button 
                  onClick={connectWebSocket}
                  className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                  title="Skip / Next"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={handleDisconnect}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-full font-bold text-sm text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all hover:scale-105 flex items-center gap-2"
                >
                  <PhoneOff className="w-4 h-4" /> End
                </button>
              </div>
            )}
          </div>
          
          {/* Local Video PIP */}
          <div className="w-36 h-48 absolute bottom-8 right-8 z-20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-xl border border-white/20 overflow-hidden bg-black">
            <VideoPlayer stream={localStream} isLocal={true} />
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
              <User className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white tracking-wider">YOU</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      {(matchStatus === 'idle') && (
        <footer className="shrink-0 py-4 px-6 border-t border-white/[0.06] bg-white/[0.02] flex justify-center gap-4">
          <button 
            onClick={connectWebSocket}
            className="group px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 transition-all rounded-xl font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(244,63,94,0.25)] hover:scale-105 duration-300"
          >
            <Search className="w-5 h-5 text-white" />
            <span className="text-white">Find Match</span>
          </button>
          <button 
            onClick={connectWebSocket}
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-all duration-300"
          >
            <Video className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Random Chat</span>
          </button>
        </footer>
      )}
    </div>
  );
};
