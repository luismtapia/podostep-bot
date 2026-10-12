import React, { useRef, useEffect, useState } from 'react';
import { Check, CheckCheck, Play, Pause, CornerUpLeft, Smile, Building2 } from 'lucide-react';
import { Message, AppointmentBooking } from '../types/chat';
import { WhatsAppDoodleBackground } from './WhatsAppDoodleBackground';
import { AppointmentCard } from './AppointmentCard';
import { InitialMenuCard } from './InitialMenuCard';

interface WhatsAppChatProps {
  messages: Message[];
  isTyping: boolean;
  onOpenProfile: () => void;
  onConfirmAppointment: (appointment: AppointmentBooking) => void;
  onReplyToMessage: (msg: Message) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  quickReplies?: string[];
  onSelectQuickReply: (text: string) => void;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  messages,
  isTyping,
  onOpenProfile,
  onConfirmAppointment,
  onReplyToMessage,
  onAddReaction,
  quickReplies,
  onSelectQuickReply,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceSpeeds, setVoiceSpeeds] = useState<{ [id: string]: number }>({});
  const [activeReactionMenu, setActiveReactionMenu] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleVoicePlay = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 3500);
    }
  };

  const cycleVoiceSpeed = (id: string) => {
    setVoiceSpeeds((prev) => {
      const current = prev[id] || 1;
      const next = current === 1 ? 1.5 : current === 1.5 ? 2 : 1;
      return { ...prev, [id]: next };
    });
  };

  const availableEmojis = ['👍', '🦶', '❤️', '👏', '😊', '🙏'];

  return (
    <div className="relative flex-1 bg-[#efeae2] overflow-hidden flex flex-col">
      {/* Background Doodles */}
      <WhatsAppDoodleBackground />

      {/* Scrollable messages container */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-6 py-3 space-y-3"
      >
        {/* Official WhatsApp Business Banner (Official Verified Account) */}
        <div
          onClick={onOpenProfile}
          className="mx-auto max-w-md bg-[#eef7f4] hover:bg-[#e4f3ee] transition-colors border border-[#cfe8df] rounded-lg p-2.5 shadow-2xs cursor-pointer text-center select-none animate-in fade-in"
        >
          <div className="flex items-center justify-center space-x-1.5 text-[#008069] text-[12px] font-medium leading-relaxed">
            <Building2 className="w-3.5 h-3.5 text-[#008069] shrink-0" />
            <span>
              Esta es una <strong>cuenta de empresa oficial verificada</strong> de Podo-Step Clínica Podológica. <span className="underline font-semibold">Toca para ver el perfil comercial.</span>
            </span>
          </div>
        </div>

        {/* Date separator chip */}
        <div className="flex justify-center my-2">
          <span className="bg-white/90 shadow-2xs text-[#54656f] text-[11px] font-medium px-3 py-1 rounded-md uppercase tracking-wider select-none">
            Hoy
          </span>
        </div>

        {/* Messages list */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col group ${
                isUser ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message Bubble container */}
              <div
                className={`relative max-w-[85%] sm:max-w-[72%] rounded-lg px-3 py-1.5 text-[14.2px] leading-relaxed shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] select-text ${
                  isUser
                    ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none'
                    : 'bg-white text-[#111b21] rounded-tl-none'
                }`}
              >
                {/* Bubble tail SVG */}
                {isUser ? (
                  <span className="absolute -top-[0px] -right-[7px] w-2 h-2 text-[#d9fdd3]">
                    <svg viewBox="0 0 8 13" height="13" width="8" className="fill-current">
                      <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
                    </svg>
                  </span>
                ) : (
                  <span className="absolute -top-[0px] -left-[7px] w-2 h-2 text-white">
                    <svg viewBox="0 0 8 13" height="13" width="8" className="fill-current">
                      <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
                    </svg>
                  </span>
                )}

                {/* Quoted Reply snippet if present */}
                {msg.replyTo && (
                  <div
                    className={`mb-1.5 p-1.5 rounded text-xs select-none border-l-4 ${
                      isUser
                        ? 'bg-[#c5f0be] border-[#00a884]'
                        : 'bg-[#f0f2f5] border-[#008069]'
                    }`}
                  >
                    <span className="font-semibold block text-[12px] text-[#00a884]">
                      {msg.replyTo.senderName}
                    </span>
                    <span className="text-gray-600 line-clamp-1 text-[11.5px]">
                      {msg.replyTo.text}
                    </span>
                  </div>
                )}

                {/* Message Body or Voice Note */}
                {msg.isVoiceNote ? (
                  <div className="flex items-center space-x-3 py-1 pr-1 min-w-[200px]">
                    <button
                      onClick={() => toggleVoicePlay(msg.id)}
                      className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 shadow-2xs hover:bg-[#008f70] transition-colors cursor-pointer"
                    >
                      {playingVoiceId === msg.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 flex items-center space-x-1">
                      {[4, 8, 14, 20, 10, 16, 22, 12, 18, 24, 15, 8, 12, 6].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}px` }}
                          className={`w-1 rounded-full ${
                            playingVoiceId === msg.id && i < 8
                              ? 'bg-[#00a884]'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex flex-col items-end text-[11px] text-gray-500">
                      <span>{msg.voiceDuration || '0:14'}</span>
                      <button
                        onClick={() => cycleVoiceSpeed(msg.id)}
                        className="text-[9px] font-bold bg-gray-200 hover:bg-gray-300 rounded px-1 mt-0.5"
                      >
                        {voiceSpeeds[msg.id] || 1}x
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words pr-12">
                    {msg.text}
                  </div>
                )}

                {/* Interactive Business Menu Card attached */}
                {msg.menuCard && (
                  <InitialMenuCard
                    menuCard={msg.menuCard}
                    onSelectItem={(payload) => onSelectQuickReply(payload)}
                  />
                )}

                {/* Interactive Appointment Voucher attached */}
                {msg.appointment && (
                  <AppointmentCard
                    appointment={msg.appointment}
                    onConfirm={onConfirmAppointment}
                  />
                )}

                {/* Message Timestamp & Checkmarks */}
                <div className="float-right -mb-1 ml-2 inline-flex items-center space-x-1 select-none text-[11px] text-[#667781]">
                  <span>{msg.timeFormatted}</span>
                  {isUser && (
                    <span className="text-[#53bdeb]">
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5" />
                      ) : msg.status === 'delivered' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </span>
                  )}
                </div>

                {/* Floating Reaction Badges */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div
                    className={`absolute -bottom-2.5 ${
                      isUser ? 'right-2' : 'left-2'
                    } flex items-center space-x-0.5 bg-white border border-gray-200 rounded-full px-1.5 py-0.5 shadow-2xs text-[12px] select-none`}
                  >
                    {msg.reactions.map((r, idx) => (
                      <span key={idx}>{r}</span>
                    ))}
                  </div>
                )}

                {/* Hover Quick Actions */}
                <div
                  className={`absolute top-1 ${
                    isUser ? '-left-12' : '-right-12'
                  } hidden group-hover:flex items-center space-x-0.5 bg-white/90 backdrop-blur-xs rounded-full p-1 shadow-md border border-gray-100 z-20`}
                >
                  <button
                    onClick={() =>
                      setActiveReactionMenu(
                        activeReactionMenu === msg.id ? null : msg.id
                      )
                    }
                    title="Reaccionar"
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors cursor-pointer"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onReplyToMessage(msg)}
                    title="Responder mensaje"
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors cursor-pointer"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reaction Picker Popover */}
                {activeReactionMenu === msg.id && (
                  <div
                    className={`absolute -top-10 ${
                      isUser ? 'right-0' : 'left-0'
                    } bg-white rounded-full px-2 py-1 shadow-lg border border-gray-200 flex items-center space-x-1.5 z-30 animate-in fade-in zoom-in-95`}
                  >
                    {availableEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          onAddReaction(msg.id, emoji);
                          setActiveReactionMenu(null);
                        }}
                        className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-white rounded-lg rounded-tl-none px-4 py-2.5 shadow-xs flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: '0.15s' }}
              ></span>
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: '0.3s' }}
              ></span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Reply Suggestion Chips */}
      {quickReplies && quickReplies.length > 0 && (
        <div className="relative z-10 px-3 py-1.5 bg-[#f0f2f5]/90 backdrop-blur-xs border-t border-[#e9edef] overflow-x-auto flex items-center space-x-2 no-scrollbar">
          <span className="text-[11px] font-semibold text-gray-500 uppercase shrink-0">
            Opciones:
          </span>
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => onSelectQuickReply(reply)}
              className="text-xs font-semibold px-3 py-1 bg-white hover:bg-[#e7f8ef] text-[#008069] rounded-full border border-emerald-300 shadow-2xs whitespace-nowrap transition-colors active:scale-95 cursor-pointer"
            >
              {reply}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
