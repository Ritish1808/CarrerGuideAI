import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Volume2, VolumeX, Loader2, X, MessageSquare, Headphones } from "lucide-react";
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { UserProfile } from "../types";

interface VoiceAdvisorProps {
  profile: UserProfile;
  onClose: () => void;
}

export function VoiceAdvisor({ profile, onClose }: VoiceAdvisorProps) {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [modelTranscription, setModelTranscription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Int16Array[]>([]);
  const isPlayingRef = useRef(false);

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            startMic();
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  const base64Data = part.inlineData.data;
                  const binaryString = atob(base64Data);
                  const bytes = new Int16Array(binaryString.length / 2);
                  for (let i = 0; i < bytes.length; i++) {
                    bytes[i] = (binaryString.charCodeAt(i * 2) & 0xFF) | (binaryString.charCodeAt(i * 2 + 1) << 8);
                  }
                  audioQueueRef.current.push(bytes);
                  if (!isPlayingRef.current) {
                    playNextChunk();
                  }
                }
              }
            }

            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              isPlayingRef.current = false;
            }

            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
              setModelTranscription(prev => prev + message.serverContent!.modelTurn!.parts[0].text);
            }
          },
          onerror: (err) => {
            console.error("Live API error:", err);
            setError("Connection error. Please try again.");
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are a helpful career advisor. Use the user's profile to give personalized advice. 
          User Profile: ${JSON.stringify(profile)}. Keep your responses concise and conversational.`,
        },
      });

      sessionRef.current = session;
    } catch (err) {
      console.error("Failed to connect:", err);
      setError("Failed to start voice session.");
      setIsConnecting(false);
    }
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = audioContextRef.current!.createMediaStreamSource(stream);
      const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMuted || !sessionRef.current) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        sessionRef.current.sendRealtimeInput({
          audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      source.connect(processor);
      processor.connect(audioContextRef.current!.destination);
    } catch (err) {
      console.error("Mic error:", err);
      setError("Microphone access denied.");
    }
  };

  const playNextChunk = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const chunk = audioQueueRef.current.shift()!;
    const buffer = audioContextRef.current!.createBuffer(1, chunk.length, 16000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < chunk.length; i++) {
      channelData[i] = chunk[i] / 0x7FFF;
    }

    const source = audioContextRef.current!.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current!.destination);
    source.onended = playNextChunk;
    source.start();
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-dark-surface w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-dark-border">
        <div className="p-6 bg-brand-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Voice Career Advisor</h3>
              <p className="text-xs text-brand-100">AI-Powered Real-time Voice</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.2 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-brand-600 rounded-full"
                />
              )}
            </AnimatePresence>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all ${isActive ? 'bg-brand-600 text-white' : 'bg-dark-bg text-dark-muted border border-dark-border'}`}>
              {isConnecting ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : isActive ? (
                <Mic className="w-10 h-10" />
              ) : (
                <MicOff className="w-10 h-10" />
              )}
            </div>
          </div>

          <h4 className="text-xl font-bold text-white mb-2">
            {isConnecting ? "Connecting..." : isActive ? "Listening..." : "Ready to talk?"}
          </h4>
          <p className="text-dark-muted text-sm mb-8 max-w-xs">
            {isActive 
              ? "Speak naturally. I can hear you and respond in real-time." 
              : "Start a voice session to get personalized career advice through conversation."}
          </p>

          {error && (
            <p className="text-sm font-bold text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-6 w-full">
              {error}
            </p>
          )}

          <div className="flex gap-4 w-full">
            {!isActive ? (
              <button
                disabled={isConnecting}
                onClick={startSession}
                className="flex-1 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                {isConnecting ? "Connecting..." : "Start Session"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex-1 py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${isMuted ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-dark-bg text-dark-muted border border-dark-border'}`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isMuted ? "Unmute" : "Mute"}
                </button>
                <button
                  onClick={stopSession}
                  className="flex-1 py-4 bg-white text-dark-bg font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  End Session
                </button>
              </>
            )}
          </div>
        </div>

        {isActive && (
          <div className="px-8 pb-8">
            <div className="p-4 bg-dark-bg rounded-2xl border border-dark-border max-h-32 overflow-y-auto">
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
                <p className="text-xs text-dark-muted italic">
                  {modelTranscription || "Waiting for response..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
