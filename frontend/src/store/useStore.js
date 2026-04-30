import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Media Streams
  localStream: null,
  remoteStream: null,
  
  // Connection Status
  connectionState: 'idle', // idle, connecting, connected, disconnected
  matchStatus: 'searching', // searching, matched, idle
  
  // Current Room
  roomId: null,
  
  // Actions
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setConnectionState: (state) => set({ connectionState: state }),
  setMatchStatus: (status) => set({ matchStatus: status }),
  setRoomId: (id) => set({ roomId: id }),
  
  // Reset for next match
  resetConnection: () => {
    const { localStream } = get();
    // Keep localStream alive, clear the rest
    set({
      remoteStream: null,
      connectionState: 'idle',
      matchStatus: 'searching',
      roomId: null
    });
  }
}));
