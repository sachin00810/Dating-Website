import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { WS_BASE_URL } from '../lib/config';

const STUN_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = () => {
  const {
    localStream,
    setLocalStream,
    setRemoteStream,
    setConnectionState,
    roomId,
    resetConnection,
  } = useStore();

  const peerConnectionRef = useRef(null);
  const wsRef = useRef(null);

  // 1. Get User Media
  const startLocalStream = useCallback(async () => {
    if (localStream) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
    } catch (err) {
      console.error('Error accessing media devices.', err);
      alert('Camera and microphone access is required.');
    }
  }, [localStream, setLocalStream]);

  // 2. Initialize WebRTC connection
  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(STUN_SERVERS);

    // Add local tracks to peer connection
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      console.log('Received remote track', event.streams[0]);
      setRemoteStream(event.streams[0]);
      setConnectionState('connected');
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({
          type: 'ice_candidate',
          candidate: event.candidate,
          roomId: useStore.getState().roomId,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionState('disconnected');
        resetConnection();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [localStream, setRemoteStream, setConnectionState, resetConnection]);

  // 3. WebSocket Signaling Logic
  const WS_URL = `${WS_BASE_URL}/ws/chat/`; 
  
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected. Entering matchmaking queue...');
      setConnectionState('idle'); // Or 'queued'
    };

    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'match_found':
          // We got matched, set room id and initiate WebRTC if we are the caller
          useStore.setState({ roomId: data.roomId, matchStatus: 'matched' });
          setConnectionState('connecting');
          
          if (data.isCaller) {
            const pc = createPeerConnection();
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendMessage({ type: 'offer', offer, roomId: data.roomId });
          }
          break;

        case 'offer':
          const pcOffer = createPeerConnection();
          await pcOffer.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pcOffer.createAnswer();
          await pcOffer.setLocalDescription(answer);
          sendMessage({ type: 'answer', answer, roomId: data.roomId });
          break;

        case 'answer':
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
          break;

        case 'ice_candidate':
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
          break;

        case 'partner_disconnected':
          resetConnection();
          // We can optionally auto-rejoin the queue here
          break;
          
        default:
          break;
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected.');
      setConnectionState('disconnected');
    };
  }, [createPeerConnection, resetConnection, setConnectionState]);

  const sendMessage = (msg) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  };

  const endCall = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (wsRef.current) {
      sendMessage({ type: 'leave_room', roomId });
      wsRef.current.close();
      wsRef.current = null;
    }

    const state = useStore.getState();
    if (state.localStream) {
      state.localStream.getTracks().forEach((track) => track.stop());
      state.setLocalStream(null);
    }

    resetConnection();
  }, [roomId, resetConnection]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      useStore.getState().toggleMute();
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      useStore.getState().toggleVideoOff();
    }
  }, [localStream]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (wsRef.current) wsRef.current.close();
      const state = useStore.getState();
      if (state.localStream) {
        state.localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    startLocalStream,
    connectWebSocket,
    endCall,
    toggleAudio,
    toggleVideo,
  };
};
