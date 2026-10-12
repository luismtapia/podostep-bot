import React from 'react';
import { X, MessageSquare } from 'lucide-react';

interface NotificationToastProps {
  notification: {
    title: string;
    body: string;
    avatar: string;
  } | null;
  onClose: () => void;
  onClick: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onClick,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-3 animate-in slide-in-from-top-4 duration-300 select-none">
      <div
        onClick={onClick}
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/80 p-3.5 flex items-start space-x-3 cursor-pointer hover:bg-white transition-all active:scale-[0.99]"
      >
        <div className="relative shrink-0">
          <img
            src={notification.avatar}
            alt="Podo-Step bot"
            className="w-10 h-10 rounded-full object-cover border border-emerald-200"
          />
          <span className="absolute -bottom-1 -right-1 bg-[#25d366] text-white p-0.5 rounded-full">
            <MessageSquare className="w-2.5 h-2.5" />
          </span>
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                WhatsApp
              </span>
              <span className="text-[10px] text-gray-400">• ahora</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              Verificado ✓
            </span>
          </div>

          <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5 flex items-center space-x-1">
            <span>{notification.title}</span>
          </h4>
          <p className="text-xs text-gray-600 line-clamp-2 mt-0.5 leading-snug">
            {notification.body}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
