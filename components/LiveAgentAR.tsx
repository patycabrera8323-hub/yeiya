
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { getSystemInstruction } from '../services/aiService';
import { Avatar } from './Avatar';
import { CharacterAgent } from './CharacterAgent';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';

interface LiveAgentARProps {
  onClose: () => void;
}

const encode = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
};

export const LiveAgentAR: React.FC<LiveAgentARProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState<string>('');
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [botVolume, setBotVolume] = useState(0);
  const [userVolume, setUserVolume] = useState(0);
  const [agentType, setAgentType] = useState<'hologram' | '3d'>('3d');

  useEffect(() => {
    const handleModeSwitch = (e: any) => {
      if (e.detail) setAgentType(e.detail);
    };
    window.addEventListener('SWITCH_AGENT_MODE', handleModeSwitch);
    return () => window.removeEventListener('SWITCH_AGENT_MODE', handleModeSwitch);
  }, []);

  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const cleanupRef = useRef<any>({});
  const analyserRef = useRef<AnalyserNode | null>(null);
  const userAnalyserRef = useRef<AnalyserNode | null>(null);

  const startVoiceSession = async () => {
    setStatus('connecting');
    setErrorDetail('');
    console.log('--- INICIANDO DIAGNÓSTICO DE CONEXIÓN ---');

    try {
      // Intentar obtener de metadatada env o process env
      const rawKey = import.meta.env.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY;
      const apiKey = rawKey?.trim();

      if (!apiKey || apiKey === 'tu_api_key_aqui' || apiKey === 'undefined') {
        const errorMsg = 'API Key no configurada. Por favor revisa tu archivo .env';
        console.error('ERROR CRÍTICO:', errorMsg);
        setErrorDetail(errorMsg);
        setStatus('error');
        return;
      }

      console.log('API Key válida detectada. Intentando conectar...');

      const ai = new GoogleGenAI({ apiKey });
      const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // CRITICAL: Ensure AudioContext is active (browsers suspend it by default until user interaction)
      if (inputContext.state === 'suspended') await inputContext.resume();
      if (outputContext.state === 'suspended') await outputContext.resume();

      const analyser = outputContext.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      analyser.connect(outputContext.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Permisos de micrófono concedidos.');

      // Setup User Analyser for mic meter
      const userAnalyser = inputContext.createAnalyser();
      userAnalyser.fftSize = 256;
      const userSource = inputContext.createMediaStreamSource(stream);
      userSource.connect(userAnalyser);
      userAnalyserRef.current = userAnalyser;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        config: {
          // El aviso de depreciación pide poner los campos directamente en config
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Puck'
              }
            }
          },
          systemInstruction: {
            parts: [{ text: 'Eres Yeiya, la conciencia digital de SEARMO. Tu tono es visionario y sofisticado. Responde de forma breve y concisa usando tu voz. No uses bloques JSON ni formatos extraños, solo habla.' }]
          }
        },
        callbacks: {
          onopen: () => {
            console.log('CONEXIÓN TOTALMENTE ESTABLECIDA CON GOOGLE ✅');
            setStatus('active');
            setErrorDetail('¡Enlace activo! Habla con Yeiya...');

            const source = inputContext.createMediaStreamSource(stream);
            const processor = inputContext.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
              // SOLO procesar si el estado sigue siendo activo
              if (status !== 'active') return;

              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for (let i = 0; i < inputData.length; i += 4) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / (inputData.length / 4));

              if (rms > 0.01 && !isBotSpeaking) setIsUserSpeaking(true);
              else if (rms < 0.005 && isUserSpeaking) setIsUserSpeaking(false);

              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) pcmData[i] = inputData[i] * 32768;

              sessionPromise.then(s => {
                // Verificar redundante que la sesión esté abierta antes de enviar
                if (s && s.sendRealtimeInput && status === 'active') {
                  try {
                    s.sendRealtimeInput({
                      media: { mimeType: 'audio/pcm;rate=16000', data: encode(new Uint8Array(pcmData.buffer)) }
                    });
                  } catch (err) {
                    console.warn("Error enviando audio (sesión cerrada)");
                  }
                }
              }).catch(() => { });
            };

            source.connect(processor);
            processor.connect(inputContext.destination);
            cleanupRef.current = { processor, source, stream };
          },
          onmessage: async (msg: LiveServerMessage) => {
            console.log('Mensaje recibido:', msg);
            if (msg.serverContent?.modelTurn?.parts) {
              console.log('El bot está respondiendo con texto/audio...');
            }

            const base64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64) {
              console.log('Mensaje de audio recibido del bot 🔊');
              setIsBotSpeaking(true);
              setIsUserSpeaking(false);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContext.currentTime);

              const pcmData = decode(base64);
              // console.log('Audio chunk size:', pcmData.length); 

              const buffer = await decodeAudioData(pcmData, outputContext, 24000, 1);
              const s = outputContext.createBufferSource();
              s.buffer = buffer;
              s.connect(analyser);
              s.addEventListener('ended', () => {
                sourcesRef.current.delete(s);
                if (sourcesRef.current.size === 0) {
                  setIsBotSpeaking(false);
                  setBotVolume(0);
                }
              });
              s.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(s);
            }
          },
          onerror: (e: any) => {
            console.error('ERROR DE WEBSOCKET / API GEMINI:', e);
            setErrorDetail(e.message || e.toString());
            setStatus('error');
            // Forzar limpieza inmediata
            stopLocalAudio();
          },
          onclose: (e: any) => {
            console.warn('LA CONEXIÓN SE CERRÓ REPENTINAMENTE ⚠️', 'Código:', e.code, 'Razón:', e.reason);
            if (status !== 'idle') {
              const reasonText = e.reason || (e.code === 1006 ? "Cierre anormal (posible error de red o de API Key)" : `Error código ${e.code}`);
              setErrorDetail(reasonText);
              setStatus('error');
              stopLocalAudio();
            }
          }
        }
      });

      // Función auxiliar para detener audio local en caso de error
      const stopLocalAudio = () => {
        if (cleanupRef.current?.processor) {
          try { cleanupRef.current.processor.disconnect(); } catch (err) { }
        }
        if (cleanupRef.current?.stream) {
          try { cleanupRef.current.stream.getTracks().forEach((t: any) => t.stop()); } catch (err) { }
        }
      };

      cleanupRef.current.session = sessionPromise;
      cleanupRef.current.contexts = { input: inputContext, output: outputContext };

    } catch (e: any) {
      console.error('ERROR CRÍTICO AL INICIAR LA SESIÓN:', e);
      setErrorDetail(e.message || e.toString());
      setStatus('error');
    }
  };

  useEffect(() => {
    let animationFrameId: number;
    const pollVolume = () => {
      // Bot Volume
      if (analyserRef.current && isBotSpeaking) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128;
          sum += v * v;
        }
        setBotVolume(Math.sqrt(sum / dataArray.length));
      }

      // User Mic Volume (Diagnostic)
      if (userAnalyserRef.current) {
        const dataArray = new Uint8Array(userAnalyserRef.current.frequencyBinCount);
        userAnalyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        setUserVolume(sum / dataArray.length / 255);
      }

      animationFrameId = requestAnimationFrame(pollVolume);
    };
    pollVolume();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isBotSpeaking]);

  useEffect(() => {
    return () => {
      const c = cleanupRef.current;
      if (c?.processor) try { c.processor.disconnect(); } catch (e) { }
      if (c?.source) try { c.source.disconnect(); } catch (e) { }
      if (c?.stream) try { c.stream.getTracks().forEach((t: any) => t.stop()); } catch (e) { }
      if (c?.contexts) {
        try { c.contexts.input.close(); } catch (e) { }
        try { c.contexts.output.close(); } catch (e) { }
      }
      if (c?.session) c.session.then((s: any) => { try { s?.close(); } catch (e) { } });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[250] bg-black flex flex-col items-center justify-center overflow-hidden font-mono">
      <div className="absolute inset-0 pointer-events-none bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.01)_0%,transparent_70%)] opacity-30"></div>
        <motion.div
          animate={{ opacity: isBotSpeaking ? 0.08 : 0.02 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400%] h-[50%] bg-[linear-gradient(rgba(0,245,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [transform:perspective(1200px)_rotateX(85deg)] origin-bottom"
        />
      </div>

      <div className="absolute top-8 right-8 z-[300]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-6 py-3 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-syncopate text-[9px] tracking-[0.3em] uppercase backdrop-blur-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer pointer-events-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        >
          COLGAR SESIÓN
        </motion.button>
      </div>


      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-visible">
          <motion.div
            animate={{
              scale: isBotSpeaking ? [1, 1.15, 1] : 1,
              opacity: isBotSpeaking ? [0.04, 0.1, 0.04] : 0.03
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute w-[50vh] h-[50vh] bg-cyan-500 rounded-full blur-[120px] pointer-events-none"
          />

          <div className="w-full h-full flex items-center justify-center overflow-visible">
            {agentType === 'hologram' ? (
              <Avatar isSpeaking={isBotSpeaking} volume={status === 'active' ? botVolume : 0.005} />
            ) : (
              <div className="w-full h-full relative">
                <Canvas
                  camera={{ position: [0, 0, 4.5], fov: 45 }}
                  style={{ background: 'transparent' }}
                >
                  <CharacterAgent isSpeaking={isBotSpeaking} volume={status === 'active' ? botVolume : 0.005} />
                </Canvas>
              </div>
            )}
          </div>

          <div className="absolute bottom-[10%] w-full flex flex-col items-center gap-8 z-[300]">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.button
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(0, 245, 255, 0.3)" }}
                  onClick={startVoiceSession}
                  className="px-16 py-5 bg-cyan-500 text-black font-syncopate text-[11px] font-bold tracking-[0.5em] uppercase rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer pointer-events-auto transition-all"
                >
                  INICIAR ENLACE
                </motion.button>
              )}

              {status === 'connecting' && (
                <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                  <div className="w-32 h-[2px] bg-cyan-950 overflow-hidden relative rounded-full">
                    <div className="absolute inset-0 bg-cyan-400 animate-[loading_2s_infinite]" />
                  </div>
                  <span className="text-[9px] font-syncopate tracking-[0.5em] text-cyan-400/70 animate-pulse uppercase">Sincronizando Neuronas...</span>
                </motion.div>
              )}

              {status === 'active' && (
                <motion.div key="active" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-8">
                  <div className="flex items-center gap-8 px-10 py-4 border border-cyan-500/30 rounded-full bg-black/60 backdrop-blur-3xl shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-cyan-400 ${isBotSpeaking ? 'animate-ping' : ''}`} />
                      <span className="text-[9px] md:text-[10px] text-cyan-400 font-syncopate tracking-[0.4em] uppercase">Agente Yeiya Online</span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isUserSpeaking && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[9px] font-syncopate text-cyan-400/50 tracking-[0.8em] uppercase">
                        Escuchando Frecuencia...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 text-center px-8">
                  <span className="text-[10px] font-syncopate tracking-[0.3em] text-red-500 uppercase font-bold">Falla de Enlace Neuronal</span>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl max-w-sm">
                    <p className="text-[9px] text-red-300 font-mono mb-2">ERROR TÉCNICO DETECTADO:</p>
                    <p className="text-[8px] text-white/80 font-mono break-words leading-relaxed">{errorDetail || "Error desconocido de conexión"}</p>
                  </div>
                  <button
                    onClick={() => { setStatus('idle'); setErrorDetail(''); }}
                    className="px-6 py-2 border border-white/20 rounded-full text-[8px] text-white/60 hover:text-white hover:border-white transition-all uppercase tracking-widest bg-white/5 mt-4"
                  >
                    Reintentar Protocolo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mic Meter (Diagnostic) */}
            <div className="mt-12 flex flex-col items-center gap-3">
              <span className="text-[7px] font-syncopate text-white/20 tracking-[0.4em] uppercase">Frecuencia Micrófono</span>
              <div className="w-32 h-[3px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500/40"
                  animate={{ width: `${Math.min(userVolume * 200, 100)}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes loading { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
      `}} />
    </div>
  );
};
