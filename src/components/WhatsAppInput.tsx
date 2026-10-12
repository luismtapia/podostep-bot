import React, { useState, useRef, useEffect } from 'react';
import {
  Smile,
  Paperclip,
  Camera,
  Mic,
  Send,
  X,
  Radio,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Message } from '../types/chat';

interface WhatsAppInputProps {
  onSendMessage: (text: string) => void;
  onSendVoiceNote: () => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  onQuickAction: (actionText: string) => void;
}

export const WhatsAppInput: React.FC<WhatsAppInputProps> = ({
  onSendMessage,
  onSendVoiceNote,
  replyingTo,
  onCancelReply,
  onQuickAction,
}) => {
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      onSendVoiceNote();
    } else {
      setIsRecording(true);
    }
  };

  const commonEmojis = ['🦶', '👍', '😊', '❤️', '🙏', '📅', '⏰', '✨', '👋', '🙌'];

  return (
    <div className="bg-[#f0f2f5] p-2 select-none relative z-20">
      {/* Quoted message reply banner */}
      {replyingTo && (
        <div className="mx-2 mb-2 bg-white rounded-lg p-2 border-l-4 border-[#00a884] flex items-center justify-between shadow-2xs animate-in slide-in-from-bottom-2">
          <div className="text-xs">
            <span className="font-bold text-[#00a884] block">
              Respondiendo a {replyingTo.sender === 'user' ? 'Ti' : 'Podo-Step bot'}
            </span>
            <span className="text-gray-600 line-clamp-1">{replyingTo.text}</span>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Attachment popup sheet with Podo-Step shortcuts */}
      {showAttachMenu && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowAttachMenu(false)}
          />
          <div className="absolute bottom-16 left-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-40 grid grid-cols-3 gap-3 w-72 animate-in zoom-in-95">
            <button
              onClick={() => {
                setShowAttachMenu(false);
                onQuickAction('Quiero agendar una cita podológica');
              }}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-emerald-50 transition-colors group cursor-pointer text-center"
            >
              <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg shadow-xs mb-1 group-hover:scale-105 transition-transform">
                🦶
              </div>
              <span className="text-[11px] font-medium text-gray-700">Agendar Cita</span>
            </button>

            <button
              onClick={() => {
                setShowAttachMenu(false);
                onQuickAction('Ver servicios y precios');
              }}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-blue-50 transition-colors group cursor-pointer text-center"
            >
              <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg shadow-xs mb-1 group-hover:scale-105 transition-transform">
                📋
              </div>
              <span className="text-[11px] font-medium text-gray-700">Servicios</span>
            </button>

            <button
              onClick={() => {
                setShowAttachMenu(false);
                onQuickAction('Ver ubicación y horarios');
              }}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-purple-50 transition-colors group cursor-pointer text-center"
            >
              <div className="w-11 h-11 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg shadow-xs mb-1 group-hover:scale-105 transition-transform">
                📍
              </div>
              <span className="text-[11px] font-medium text-gray-700">Ubicación</span>
            </button>
          </div>
        </>
      )}

      {/* Emoji picker shelf */}
      {showEmojiPicker && (
        <div className="mb-2 p-2 bg-white rounded-xl shadow-xs border border-gray-200 flex flex-wrap gap-2 animate-in fade-in">
          {commonEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputText((prev) => prev + emoji);
                inputRef.current?.focus();
              }}
              className="text-xl p-1.5 hover:bg-gray-100 rounded-lg transition-transform hover:scale-125 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar Row */}
      <div className="flex items-center space-x-1.5">
        <div className="flex-1 bg-white rounded-full flex items-center px-3 py-1.5 shadow-2xs border border-transparent focus-within:border-emerald-300 transition-colors">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emojis"
            className="p-1 text-[#54656f] hover:text-[#111b21] transition-colors cursor-pointer"
          >
            <Smile className="w-5 h-5" />
          </button>

          {isRecording ? (
            <div className="flex-1 px-3 flex items-center space-x-2 text-red-600 animate-pulse">
              <Radio className="w-4 h-4" />
              <span className="text-xs font-semibold">
                Grabando consulta por audio... 0:{recordSeconds.toString().padStart(2, '0')}
              </span>
            </div>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mensaje"
              className="flex-1 px-2.5 py-1 text-[15px] text-[#111b21] placeholder-[#8696a0] focus:outline-none bg-transparent"
            />
          )}

          <div className="flex items-center space-x-1 text-[#54656f]">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              title="Opciones rápidas"
              className="p-1 hover:text-[#111b21] transition-colors cursor-pointer"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {!inputText.trim() && !isRecording && (
              <button
                onClick={() => onQuickAction('Te comparto una fotografía de la molestia en mi pie 📸')}
                title="Cámara"
                className="p-1 hover:text-[#111b21] transition-colors cursor-pointer"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Circular Action Button */}
        {inputText.trim() ? (
          <button
            onClick={handleSend}
            title="Enviar mensaje"
            className="w-11 h-11 rounded-full bg-[#00a884] hover:bg-[#008f70] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-90 cursor-pointer"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        ) : (
          <button
            onClick={handleMicClick}
            title={isRecording ? 'Enviar audio' : 'Grabar nota de voz'}
            className={`w-11 h-11 rounded-full text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-90 cursor-pointer ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#00a884] hover:bg-[#008f70]'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
