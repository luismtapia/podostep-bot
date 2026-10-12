import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Download, ExternalLink, MapPin, User, Sparkles } from 'lucide-react';
import { AppointmentBooking } from '../types/chat';
import { formatDateSpanish, formatTimeSpanish, downloadICS } from '../utils/calendar';

interface AppointmentCardProps {
  appointment: AppointmentBooking;
  onConfirm?: (appointment: AppointmentBooking) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onConfirm,
}) => {
  const isConfirmed = appointment.status === 'confirmed';

  return (
    <div className="mt-2.5 bg-white/95 border border-emerald-300 rounded-xl p-3.5 shadow-sm text-left max-w-sm overflow-hidden select-none">
      {/* Card Header: Podo-Step Branding */}
      <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
            🦶
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Podo-Step Clínica
              </span>
              <svg viewBox="0 0 18 18" width="12" height="12" className="text-[#00a884] fill-current">
                <circle cx="9" cy="9" r="8" fill="#00a884" />
                <path d="M6 9.2l2 2 4.2-4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-[13.5px] text-gray-900 leading-tight block">
              {appointment.serviceName}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
            isConfirmed
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}
        >
          {isConfirmed ? (
            <>
              <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-600" /> Confirmada
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 mr-0.5 text-amber-600" /> Por Confirmar
            </>
          )}
        </span>
      </div>

      {/* Appointment Ticket Body */}
      <div className="py-2.5 space-y-2 text-xs text-gray-700">
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
          <span className="text-[11px] text-gray-500 font-medium">Folio de Cita:</span>
          <span className="font-mono font-bold text-gray-800 text-xs">
            #{appointment.id}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-800">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-medium capitalize">
            {formatDateSpanish(appointment.date)}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-800">
          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            {formatTimeSpanish(appointment.time)} ({appointment.durationMinutes} minutos)
          </span>
        </div>

        <div className="flex items-start space-x-2 text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-tight">
            {appointment.clinicLocation}
          </span>
        </div>

        {appointment.patientName && (
          <div className="flex items-center space-x-2 text-gray-600 text-[11px]">
            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Paciente: <strong className="text-gray-800">{appointment.patientName}</strong></span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-gray-100 flex flex-col space-y-1.5">
        {!isConfirmed && onConfirm && (
          <button
            onClick={() => onConfirm(appointment)}
            className="w-full py-2 bg-[#00a884] hover:bg-[#008f70] text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-transform active:scale-[0.98] cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmar mi Cita Podológica</span>
          </button>
        )}

        {isConfirmed && (
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {appointment.googleCalendarUrl && (
              <a
                href={appointment.googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors border border-blue-200"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Google Calendar</span>
              </a>
            )}

            <button
              onClick={() => downloadICS(appointment)}
              className="py-1.5 px-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors border border-gray-200 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Guardar (.ics)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
