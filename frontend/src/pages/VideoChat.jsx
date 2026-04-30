import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useWebRTC } from '../hooks/useWebRTC';
import { VideoPlayer } from '../components/VideoPlayer';
import { Video, VideoOff, PhoneOff, Search } from 'lucide-react';

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

      {/* Main Video Area */}
      <main className="flex-1 flex flex-col md:flex-row gap-4 mb-6 relative">
        
        {/* Remote Video (Main focus) */}
        <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/50 border border-gray-800 shadow-xl">
          {matchStatus === 'searching' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
              <Search className="w-16 h-16 text-[#ff4b4b] animate-pulse mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Finding a Match...</h2>
              <p className="text-gray-400">Looking for someone nearby</p>
            </div>
          )}
          <VideoPlayer stream={remoteStream} isLocal={false} />
        </div>

        {/* Local Video (Floating on mobile, side on desktop) */}
        <div className="w-full md:w-1/3 lg:w-1/4 h-64 md:h-auto absolute bottom-4 right-4 md:relative md:bottom-0 md:right-0 z-20 shadow-2xl rounded-2xl border border-gray-700 overflow-hidden">
          <VideoPlayer stream={localStream} isLocal={true} />
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
