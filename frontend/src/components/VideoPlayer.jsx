import { useEffect, useRef } from 'react';

export const VideoPlayer = ({ stream, isLocal = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  if (!stream) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center rounded-2xl border border-white/5">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white/10" />
          </div>
          <p className="text-gray-500 font-medium text-sm tracking-wider">Waiting for connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
      />
    </div>
  );
};

