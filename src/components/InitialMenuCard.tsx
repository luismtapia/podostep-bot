import React from 'react';
import { BusinessMenuCard } from '../types/chat';

interface InitialMenuCardProps {
  menuCard: BusinessMenuCard;
  onSelectItem: (actionPayload: string) => void;
}

export const InitialMenuCard: React.FC<InitialMenuCardProps> = ({
  menuCard,
  onSelectItem,
}) => {
  return (
    <div className="mt-2 bg-white/95 border border-emerald-200 rounded-xl p-3 shadow-xs text-left max-w-sm overflow-hidden select-none">
      {/* Menu Header */}
      <div className="pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-1.5">
          <span className="font-bold text-[13.5px] text-gray-900 leading-tight">
            {menuCard.title}
          </span>
          <svg viewBox="0 0 18 18" width="13" height="13" className="text-[#00a884] fill-current shrink-0">
            <circle cx="9" cy="9" r="8" fill="#00a884" />
            <path d="M6 9.2l2 2 4.2-4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-[11.5px] text-gray-600 mt-0.5">
          {menuCard.subtitle}
        </p>
      </div>

      {/* Interactive Options List */}
      <div className="py-2 space-y-1.5">
        {menuCard.items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item.actionPayload)}
            className="w-full text-left p-2 rounded-lg bg-gray-50/80 hover:bg-emerald-50/70 border border-gray-200/80 hover:border-emerald-300 transition-all flex items-start space-x-2.5 group cursor-pointer active:scale-[0.98]"
          >
            <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-xs text-gray-900 group-hover:text-emerald-800 block truncate">
                {item.label}
              </span>
              <span className="text-[11px] text-gray-500 line-clamp-1 block">
                {item.description}
              </span>
            </div>
            <span className="text-gray-400 group-hover:text-emerald-600 text-xs self-center">
              →
            </span>
          </button>
        ))}
      </div>

      {/* Menu Footer hint */}
      <div className="pt-1.5 border-t border-gray-100 text-center">
        <span className="text-[10px] text-gray-400">
          Toca una opción o escribe directamente tu consulta
        </span>
      </div>
    </div>
  );
};
