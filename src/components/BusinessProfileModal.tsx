import React from 'react';
import { X, MapPin, Clock, Phone, Building2, CheckCircle2, ChevronRight } from 'lucide-react';
import { BusinessContactInfo } from '../types/chat';
import { PODIATRY_SERVICES, CLINIC_INFO } from '../utils/podiatryData';

interface BusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: BusinessContactInfo;
  onSelectService: (serviceName: string) => void;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  isOpen,
  onClose,
  contact,
  onSelectService,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#008069] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-200" />
            <h2 className="font-semibold text-base">Perfil de Empresa</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Avatar and Verification */}
          <div className="flex flex-col items-center text-center pb-3 border-b border-gray-100">
            <div className="relative">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md ring-4 ring-emerald-50"
              />
              <span className="absolute bottom-0 right-0 bg-[#00a884] text-white p-1 rounded-full shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="flex items-center space-x-1.5 mt-3">
              <h3 className="font-bold text-lg text-gray-900">{contact.name}</h3>
              <svg viewBox="0 0 18 18" width="16" height="16" className="text-[#00a884] fill-current">
                <circle cx="9" cy="9" r="8" fill="#00a884" />
                <path d="M6 9.2l2 2 4.2-4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200">
              Cuenta de empresa oficial
            </span>

            <p className="text-xs text-gray-500 mt-2 max-w-xs">
              WhatsApp verificó que esta es la cuenta oficial de {CLINIC_INFO.name}.
            </p>
          </div>

          {/* Details list */}
          <div className="space-y-3 text-xs text-gray-700">
            <div className="flex items-start space-x-3 p-2.5 bg-gray-50 rounded-xl">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block">Dirección:</span>
                <span className="text-gray-600">{CLINIC_INFO.address}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 bg-gray-50 rounded-xl">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block">Horario de Atención:</span>
                <span className="text-gray-600">{CLINIC_INFO.workingHours}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 bg-gray-50 rounded-xl">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block">Teléfono de Citas:</span>
                <span className="text-gray-600">{CLINIC_INFO.phone}</span>
              </div>
            </div>
          </div>

          {/* Catalog preview */}
          <div className="pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">
              Servicios Destacados
            </h4>
            <div className="space-y-2">
              {PODIATRY_SERVICES.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onClose();
                    onSelectService(`Quiero agendar ${s.name}`);
                  }}
                  className="p-2.5 bg-emerald-50/50 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div>
                    <span className="font-bold text-xs text-gray-900 group-hover:text-emerald-800 block">
                      {s.name}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {s.price} • {s.durationMinutes} min
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#00a884] hover:bg-[#008f70] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
          >
            Volver al chat
          </button>
        </div>
      </div>
    </div>
  );
};
