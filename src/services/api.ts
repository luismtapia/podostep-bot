import { AppointmentBooking, Message } from '../types/chat';
import { processPodoStepMessage, BotProcessResult } from '../utils/nlp';
import { buildGoogleCalendarUrl } from '../utils/calendar';
import { CLINIC_INFO } from '../utils/podiatryData';

export async function sendPodoStepChatMessage(
  messageText: string,
  history: Message[],
  pendingBooking?: AppointmentBooking | null,
  patientName: string = 'Paciente'
): Promise<BotProcessResult> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: messageText,
        history: history.slice(-6).map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.text) {
        const jsonMatch = data.text.match(/```json\s*([\s\S]*?)\s*```/);
        let appointment: AppointmentBooking | undefined = undefined;

        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsedJson = JSON.parse(jsonMatch[1]);
            if (parsedJson.scheduleIntent && parsedJson.date && parsedJson.time) {
              appointment = {
                id: 'PS-' + Math.floor(10000 + Math.random() * 90000),
                serviceName: parsedJson.serviceName || 'Quiropodia Integral',
                date: parsedJson.date,
                time: parsedJson.time,
                durationMinutes: parsedJson.durationMinutes || 45,
                patientName: patientName || 'Paciente',
                status: 'draft',
                clinicLocation: CLINIC_INFO.address,
                notes: 'Agendado mediante Podo-Step Bot',
                createdAt: new Date().toISOString(),
              };
              appointment.googleCalendarUrl = buildGoogleCalendarUrl(appointment);
            }
          } catch (e) {
            console.error('Failed to parse model appointment JSON', e);
          }
        }

        const cleanedText = data.text.replace(/```json[\s\S]*?```/, '').trim();

        return {
          replyText: cleanedText || data.text,
          appointment,
          action: appointment ? 'suggest' : 'none',
          quickReplies: appointment
            ? ['✅ Sí, confirmar cita', '🔄 Cambiar horario', '📋 Ver otros servicios', 'Cancelar']
            : ['🦶 Agendar Cita', '📋 Servicios y Precios', '📍 Ubicación y Horarios', 'Menú'],
        };
      }
    }
  } catch {
    // Local fallback
  }

  return processPodoStepMessage(messageText, pendingBooking, patientName);
}

export async function saveAppointmentToClinicBackend(
  appointment: AppointmentBooking
): Promise<boolean> {
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error saving appointment to backend', err);
    return false;
  }
}
