import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Media Streams
  localStream: null,
  remoteStream: null,
  
  // Media State
  isMuted: false,
  isVideoOff: false,
  
  // User Profile
  userProfile: null,
  
  // Messages
  messages: [],
  
  // Connection Status
  connectionState: 'idle', // idle, connecting, connected, disconnected
  matchStatus: 'idle', // idle, searching, matched
  
  // Current Room
  roomId: null,
  
  // Actions
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setConnectionState: (state) => set({ connectionState: state }),
  setMatchStatus: (status) => set({ matchStatus: status }),
  setRoomId: (id) => set({ roomId: id }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideoOff: () => set((state) => ({ isVideoOff: !state.isVideoOff })),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  
  // Reset for next match
  resetConnection: () => {
    set({
      remoteStream: null,
      connectionState: 'idle',
      matchStatus: 'idle',
      roomId: null,
      isMuted: false,
      isVideoOff: false,
      messages: [],
    });
  }
}));
