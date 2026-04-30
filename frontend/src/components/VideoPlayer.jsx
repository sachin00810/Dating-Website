import { useEffect, useRef } from 'react';

export const VideoPlayer = ({ stream, isLocal = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-2xl border border-gray-700">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-700 mb-4"></div>
          <p className="text-gray-400 font-medium">Waiting for video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
      />
      {isLocal && (
        <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="text-xs font-semibold text-white">You</span>
        </div>
      )}
    </div>
  );
};
