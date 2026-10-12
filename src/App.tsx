import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Message,
  AppointmentBooking,
  BusinessContactInfo,
} from './types/chat';
import { WhatsAppHeader } from './components/WhatsAppHeader';
import { WhatsAppChat } from './components/WhatsAppChat';
import { WhatsAppInput } from './components/WhatsAppInput';
import { BusinessProfileModal } from './components/BusinessProfileModal';
import { CallModal } from './components/CallModal';
import { NotificationToast } from './components/NotificationToast';
import { audioService } from './utils/audio';
import { buildGoogleCalendarUrl } from './utils/calendar';
import { getInitialMenuCard } from './utils/nlp';
import { CLINIC_INFO } from './utils/podiatryData';
import {
  sendPodoStepChatMessage,
  saveAppointmentToClinicBackend,
} from './services/api';
import {
  Building2,
  CalendarCheck,
} from 'lucide-react';

export default function App() {
  // Business contact information: Podo-Step bot
  const [contact, setContact] = useState<BusinessContactInfo>({
    name: 'Podo-Step bot',
    avatar:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=250&q=80',
    phone: CLINIC_INFO.phone,
    category: 'Clínica Podológica • Salud del Pie',
    status: 'en línea',
    isOnline: true,
    isTyping: false,
    address: CLINIC_INFO.address,
    workingHours: CLINIC_INFO.workingHours,
    isVerified: true,
  });

  // Initial greeting message with Podo-Step interactive business menu
  const initialMessages: Message[] = [
    {
      id: 'm1',
      sender: 'assistant',
      text: '¡Hola! 👋 Te damos la bienvenida a la cuenta oficial de *Podo-Step Clínica Podológica* 🦶\n\nSomos especialistas en salud podológica integral: quiropodia médica, tratamiento de uña encarnada, pie diabético, estudio biomecánico de la pisada y más.',
      timestamp: '2026-10-12T10:30:00',
      timeFormatted: '10:30 a. m.',
      status: 'read',
      menuCard: getInitialMenuCard(),
    },
    {
      id: 'm2',
      sender: 'assistant',
      text: 'Por favor, selecciona una opción del menú interactivo o indícame qué molestia presentas para sugerirte el tratamiento adecuado y apartar tu cita. 👇',
      timestamp: '2026-10-12T10:30:05',
      timeFormatted: '10:30 a. m.',
      status: 'read',
    },
  ];

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('podostep_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialMessages;
      }
    }
    return initialMessages;
  });

  const [pendingBooking, setPendingBooking] = useState<AppointmentBooking | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    '🦶 Agendar Cita',
    '📋 Servicios y Precios',
    '📍 Ubicación y Horarios',
    'Menú Principal',
  ]);

  // Modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [callModal, setCallModal] = useState<{ isOpen: boolean; type: 'audio' | 'video' }>({
    isOpen: false,
    type: 'audio',
  });

  // Audio & Notification states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notification, setNotification] = useState<{
    title: string;
    body: string;
    avatar: string;
  } | null>(null);

  // Sync chat messages to LocalStorage
  useEffect(() => {
    localStorage.setItem('podostep_chat_messages', JSON.stringify(messages));
  }, [messages]);

  const triggerRealtimeNotification = (title: string, body: string) => {
    audioService.playReceiveSound();

    setNotification({
      title,
      body,
      avatar: contact.avatar,
    });
    setTimeout(() => {
      setNotification((n) => (n?.body === body ? null : n));
    }, 4500);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: contact.avatar,
        });
      } catch {}
    }
  };

  const handleSendMessage = async (text: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const userMsg: Message = {
      id: 'msg-' + Date.now().toString(36),
      sender: 'user',
      text,
      timestamp: now.toISOString(),
      timeFormatted,
      status: 'sent',
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.sender === 'user' ? 'Tú' : contact.name,
            text: replyingTo.text,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setReplyingTo(null);
    audioService.playSendSound();

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 400);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'read' } : m))
      );
    }, 900);

    // Bot Typing Simulation
    setContact((c) => ({ ...c, isTyping: true, status: 'escribiendo...' }));

    setTimeout(async () => {
      const result = await sendPodoStepChatMessage(
        text,
        [...messages, userMsg],
        pendingBooking,
        'Paciente'
      );

      setContact((c) => ({ ...c, isTyping: false, status: 'en línea' }));

      const replyNow = new Date();
      const replyTimeFormatted = replyNow.toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const botMsg: Message = {
        id: 'msg-' + (Date.now() + 1).toString(36),
        sender: 'assistant',
        text: result.replyText,
        timestamp: replyNow.toISOString(),
        timeFormatted: replyTimeFormatted,
        status: 'delivered',
        appointment: result.appointment,
        menuCard: result.menuCard,
      };

      setMessages((prev) => [...prev, botMsg]);
      triggerRealtimeNotification('Podo-Step bot', result.replyText);

      if (result.quickReplies) {
        setQuickReplies(result.quickReplies);
      }

      if (result.appointment) {
        setPendingBooking(result.appointment);
        if (result.action === 'confirm') {
          handleConfirmAppointment(result.appointment);
        }
      }
    }, 1100);
  };

  const handleSendVoiceNote = async () => {
    audioService.playRecordBeep();
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const voiceMsg: Message = {
      id: 'voice-' + Date.now().toString(36),
      sender: 'user',
      text: 'Consulta de voz',
      isVoiceNote: true,
      voiceDuration: '0:15',
      timestamp: now.toISOString(),
      timeFormatted,
      status: 'read',
    };

    setMessages((prev) => [...prev, voiceMsg]);
    audioService.playSendSound();

    setContact((c) => ({ ...c, isTyping: true, status: 'escribiendo...' }));
    setTimeout(async () => {
      setContact((c) => ({ ...c, isTyping: false, status: 'en línea' }));
      const botText =
        '¡Escuché tu nota de audio con atención! 🩺 Entiendo la molestia que refieres en tu pie. Te sugiero agendar una valoración de quiropodia o tratamiento de uña encarnada para atenderte en clínica. ¿Te parece bien apartar tu cita para mañana a las 11:00 a. m.?';

      const botMsg: Message = {
        id: 'msg-' + (Date.now() + 1).toString(36),
        sender: 'assistant',
        text: botText,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString('es-ES', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        status: 'delivered',
      };

      setMessages((prev) => [...prev, botMsg]);
      triggerRealtimeNotification('Podo-Step bot', botText);
      setQuickReplies(['✅ Sí, apartar para mañana 11am', '📋 Ver otros horarios', 'Menú']);
    }, 1300);
  };

  const handleConfirmAppointment = async (appointment: AppointmentBooking) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
    });

    const updatedBooking: AppointmentBooking = {
      ...appointment,
      status: 'confirmed',
      googleCalendarUrl: buildGoogleCalendarUrl({ ...appointment, status: 'confirmed' }),
    };

    setMessages((prev) =>
      prev.map((m) =>
        m.appointment?.id === appointment.id
          ? { ...m, appointment: updatedBooking }
          : m
      )
    );
    setPendingBooking(null);

    // Save in backend clinic store for doctor app
    await saveAppointmentToClinicBackend(updatedBooking);

    audioService.playReceiveSound();
    triggerRealtimeNotification(
      '✅ Cita Podológica Confirmada',
      `Tu cita de ${appointment.serviceName} quedó registrada con folio #${appointment.id}.`
    );
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const current = m.reactions || [];
          return {
            ...m,
            reactions: current.includes(emoji) ? current : [...current, emoji],
          };
        }
        return m;
      })
    );
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
    setPendingBooking(null);
  };

  const handleShowMenu = () => {
    handleSendMessage('menu');
  };

  return (
    <div className="min-h-screen bg-[#d1d7db] flex flex-col items-center justify-center p-0 md:p-4 font-sans text-slate-800">
      {/* Top Banner for Podo-Step Official Bot */}
      <header className="w-full max-w-lg mb-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xs border border-gray-200 hidden md:flex items-center justify-between text-xs select-none">
        <div className="flex items-center space-x-2">
          <span className="text-base">🦶</span>
          <div className="flex items-center space-x-1">
            <span className="font-bold text-gray-900">Podo-Step bot</span>
            <svg viewBox="0 0 18 18" width="13" height="13" className="text-[#00a884] fill-current">
              <circle cx="9" cy="9" r="8" fill="#00a884" />
              <path d="M6 9.2l2 2 4.2-4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="bg-emerald-100 text-[#008069] px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-200">
            Cuenta Oficial Verificada
          </span>
        </div>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#008069] border border-emerald-200 rounded-lg text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Ver Clínica</span>
        </button>
      </header>

      {/* Main WhatsApp Frame (Exact replica of user screenshot layout) */}
      <div className="w-full max-w-md h-[100dvh] md:h-[90vh] md:max-h-[860px] bg-[#efeae2] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-300/80 relative">
        {/* Header with Verified Badge */}
        <WhatsAppHeader
          contact={contact}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onStartCall={(type) => setCallModal({ isOpen: true, type })}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            audioService.setSoundEnabled(next);
          }}
          onResetChat={handleResetChat}
          onShowMenu={handleShowMenu}
        />

        {/* Chat Body */}
        <WhatsAppChat
          messages={messages}
          isTyping={contact.isTyping}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onConfirmAppointment={handleConfirmAppointment}
          onReplyToMessage={(msg) => setReplyingTo(msg)}
          onAddReaction={handleAddReaction}
          quickReplies={quickReplies}
          onSelectQuickReply={(text) => handleSendMessage(text)}
        />

        {/* Message Input Bar */}
        <WhatsAppInput
          onSendMessage={handleSendMessage}
          onSendVoiceNote={handleSendVoiceNote}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          onQuickAction={(text) => handleSendMessage(text)}
        />
      </div>

      {/* Real-time Push Notification Banner */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
        onClick={() => {
          setNotification(null);
          setIsProfileModalOpen(true);
        }}
      />

      {/* Official WhatsApp Business Profile Modal */}
      <BusinessProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        contact={contact}
        onSelectService={(serviceQuery) => handleSendMessage(serviceQuery)}
      />

      {/* Clinic Call Screen Modal */}
      <CallModal
        isOpen={callModal.isOpen}
        type={callModal.type}
        contactName={contact.name}
        avatar={contact.avatar}
        onClose={() => setCallModal({ isOpen: false, type: 'audio' })}
      />
    </div>
  );
}
