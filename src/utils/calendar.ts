import { AppointmentBooking } from '../types/chat';

/**
 * Builds Google Calendar link for the patient's personal calendar reminder
 */
export function buildGoogleCalendarUrl(appointment: AppointmentBooking): string {
  try {
    const [year, month, day] = appointment.date.split('-').map(Number);
    const [hours, minutes] = appointment.time.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + (appointment.durationMinutes || 45) * 60000);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const startStr = `${startDate.getFullYear()}${pad(startDate.getMonth() + 1)}${pad(startDate.getDate())}T${pad(startDate.getHours())}${pad(startDate.getMinutes())}00`;
    const endStr = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;

    const title = encodeURIComponent(`Cita Podológica: ${appointment.serviceName} - Podo-Step`);
    const details = encodeURIComponent(
      `Cita en Podo-Step Clínica Podológica.\nPaciente: ${appointment.patientName}\nServicio: ${appointment.serviceName}\nUbicación: ${appointment.clinicLocation}\nFolio de confirmación: ${appointment.id}`
    );
    const location = encodeURIComponent(appointment.clinicLocation);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
  } catch {
    return 'https://calendar.google.com';
  }
}

/**
 * Generates an RFC 5545 standard .ics file string for patient reminder
 */
export function generateICS(appointment: AppointmentBooking): string {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const [hours, minutes] = appointment.time.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + (appointment.durationMinutes || 45) * 60000);

  const formatICSDate = (d: Date): string => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const uid = `podo-step-${appointment.id}@podostep.clinic`;
  const summary = `Cita Podológica: ${appointment.serviceName} (Podo-Step)`;
  const description = `Cita en Podo-Step Clínica Podológica.\\nPaciente: ${appointment.patientName}\\nServicio: ${appointment.serviceName}\\nFolio: ${appointment.id}\\nUbicación: ${appointment.clinicLocation}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Podo-Step Bot//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${appointment.clinicLocation}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers patient .ics download
 */
export function downloadICS(appointment: AppointmentBooking) {
  const icsData = generateICS(appointment);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `cita-podostep-${appointment.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatTimeSpanish(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'p. m.' : 'a. m.';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function formatDateSpanish(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
