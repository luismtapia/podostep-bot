import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, Building2 } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  type: 'audio' | 'video';
  contactName: string;
  avatar: string;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  type,
  contactName,
  avatar,
  onClose,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [status, setStatus] = useState<'ringing' | 'connected'>('ringing');
  const [muted, setMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setStatus('ringing');
      setCallDuration(0);

      const connectTimeout = setTimeout(() => {
        setStatus('connected');
      }, 2500);

      timer = setInterval(() => {
        setCallDuration((s) => s + 1);
      }, 1000);

      return () => {
        clearTimeout(connectTimeout);
        clearInterval(timer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatSec = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#111b21] rounded-3xl max-w-sm w-full h-[580px] shadow-2xl border border-gray-800 flex flex-col justify-between p-6 text-white relative overflow-hidden">
        {/* Top header */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] text-emerald-400 font-medium border border-emerald-500/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>Cuenta Oficial • Podo-Step</span>
          </div>

          <div className="flex items-center justify-center space-x-1 mt-4">
            <h3 className="font-bold text-xl">{contactName}</h3>
            <svg viewBox="0 0 18 18" width="16" height="16" className="text-[#00a884] fill-current">
              <circle cx="9" cy="9" r="8" fill="#00a884" />
              <path d="M6 9.2l2 2 4.2-4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            {status === 'ringing'
              ? type === 'video'
                ? 'Videollamada de WhatsApp con la clínica...'
                : 'Llamando a la clínica...'
              : formatSec(callDuration)}
          </p>
        </div>

        {/* Center avatar */}
        <div className="flex flex-col items-center justify-center flex-1 my-4">
          <div className="relative">
            <img
              src={avatar}
              alt={contactName}
              className={`w-32 h-32 rounded-full object-cover border-4 border-emerald-500/40 shadow-2xl ${
                status === 'ringing' ? 'animate-pulse' : ''
              }`}
            />
            {type === 'video' && !videoDisabled && (
              <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                <Video className="w-4 h-4" />
              </span>
            )}
          </div>

          {status === 'connected' && (
            <p className="text-xs text-emerald-400 mt-4 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              🎙️ En línea con recepción de Podo-Step
            </p>
          )}
        </div>

        {/* Action controls */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 flex items-center justify-around border border-white/5">
          <button
            onClick={() => setMuted(!muted)}
            className={`p-3.5 rounded-full transition-colors cursor-pointer ${
              muted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {type === 'video' && (
            <button
              onClick={() => setVideoDisabled(!videoDisabled)}
              className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                videoDisabled ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {videoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          <button
            title="Altavoz"
            className="p-3.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            title="Finalizar llamada"
            className="p-3.5 rounded-full bg-[#ea0038] hover:bg-[#c90030] text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
