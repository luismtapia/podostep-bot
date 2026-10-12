import React, { useState } from 'react';
import { ArrowLeft, Video, Phone, MoreVertical, Bell, BellOff, RefreshCw, MapPin, Clock, Info } from 'lucide-react';
import { BusinessContactInfo } from '../types/chat';

interface WhatsAppHeaderProps {
  contact: BusinessContactInfo;
  onOpenProfile: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetChat: () => void;
  onShowMenu: () => void;
}

export const WhatsAppHeader: React.FC<WhatsAppHeaderProps> = ({
  contact,
  onOpenProfile,
  onStartCall,
  soundEnabled,
  onToggleSound,
  onResetChat,
  onShowMenu,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-[#f0f2f5] border-b border-[#e9edef] select-none sticky top-0 z-30 shadow-xs">
      {/* Phone status bar (Android/WhatsApp mobile header: 10:36 AM, 4G, 38% battery like user's photo) */}
      <div className="flex items-center justify-between px-4 pt-1.5 pb-1 text-[11px] font-medium text-[#111b21] tracking-tight bg-white/70 backdrop-blur-xs">
        <span>10:36 AM</span>
        <div className="flex items-center space-x-1.5 opacity-85">
          <span className="text-[10px]">📶</span>
          <span className="text-[10px]">Wi-Fi</span>
          <div className="flex items-center border border-gray-600 rounded-xs px-1 py-[1px] text-[9px] font-bold">
            <span>38</span>
          </div>
        </div>
      </div>

      {/* Main WhatsApp Header Bar */}
      <div className="flex items-center justify-between px-2 py-2 bg-white">
        {/* Left: Back button + Clinic Avatar + Verified Name & Status */}
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <button
            title="Atrás"
            className="p-1 text-[#54656f] hover:bg-black/5 rounded-full transition-colors active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Clinic Avatar with green online badge */}
          <div
            onClick={onOpenProfile}
            className="relative cursor-pointer group"
            title="Ver información de Podo-Step Clínica Podológica"
          >
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover border border-emerald-100 shadow-2xs group-hover:opacity-90 transition-opacity ring-1 ring-emerald-500/30"
            />
            {contact.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25d366] border-2 border-white rounded-full"></span>
            )}
          </div>

          {/* Contact Name with Official WhatsApp Verified Badge */}
          <div
            onClick={onOpenProfile}
            className="flex flex-col min-w-0 cursor-pointer group leading-tight"
          >
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-[15.5px] text-[#111b21] truncate group-hover:underline">
                {contact.name}
              </span>

              {/* Official WhatsApp Verified Green Badge */}
              {contact.isVerified && (
                <span title="Cuenta oficial verificada de WhatsApp" className="inline-flex items-center shrink-0">
                  <svg
                    viewBox="0 0 18 18"
                    width="15"
                    height="15"
                    className="text-[#00a884] fill-current"
                  >
                    <circle cx="9" cy="9" r="8" fill="#00a884" />
                    <path
                      d="M6 9.2l2 2 4.2-4.4"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>

            <span className="text-[12px] truncate text-[#667781] font-normal">
              {contact.isTyping ? (
                <span className="text-[#00a884] font-medium animate-pulse">
                  escribiendo...
                </span>
              ) : contact.isOnline ? (
                <span className="text-[#00a884] font-medium flex items-center space-x-1">
                  <span>en línea</span>
                  <span className="text-gray-400">• Cuenta de empresa oficial</span>
                </span>
              ) : (
                contact.status
              )}
            </span>
          </div>
        </div>

        {/* Right actions: Call, Video, 3-dots Menu */}
        <div className="flex items-center space-x-1 text-[#54656f]">
          <button
            onClick={() => onStartCall('video')}
            title="Videollamada con Podo-Step"
            className="p-2 hover:bg-black/5 rounded-full transition-colors active:scale-95 cursor-pointer"
          >
            <Video className="w-5 h-5 text-[#54656f]" />
          </button>

          <button
            onClick={() => onStartCall('audio')}
            title="Llamada a la clínica Podo-Step"
            className="p-2 hover:bg-black/5 rounded-full transition-colors active:scale-95 cursor-pointer"
          >
            <Phone className="w-5 h-5 text-[#54656f]" />
          </button>

          {/* Quick Menu Button */}
          <button
            onClick={onShowMenu}
            title="Menú de citas y servicios"
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#e7f8ef] hover:bg-[#d0f1df] text-[#008069] rounded-full text-xs font-semibold transition-colors cursor-pointer ml-1 border border-emerald-300"
          >
            <span>Menú</span>
          </button>

          {/* 3-dots Menu dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              title="Más opciones"
              className="p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            >
              <MoreVertical className="w-5 h-5 text-[#54656f]" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50 text-sm text-[#111b21] animate-in fade-in duration-100">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Info className="w-4 h-4 text-[#00a884]" />
                    <span>Ver perfil de la clínica</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onShowMenu();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <span>🦶</span>
                    <span>Menú principal de citas</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onToggleSound();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    {soundEnabled ? (
                      <>
                        <BellOff className="w-4 h-4 text-orange-500" />
                        <span>Silenciar notificaciones</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 text-green-600" />
                        <span>Activar sonido de WhatsApp</span>
                      </>
                    )}
                  </button>

                  <div className="h-px bg-gray-100 my-1" />

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onResetChat();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reiniciar chat</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
