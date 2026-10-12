import { AppointmentBooking, BusinessMenuCard } from '../types/chat';
import { PODIATRY_SERVICES, CLINIC_INFO } from './podiatryData';
import { buildGoogleCalendarUrl, formatDateSpanish, formatTimeSpanish } from './calendar';

export interface BotProcessResult {
  replyText: string;
  appointment?: AppointmentBooking;
  action?: 'suggest' | 'confirm' | 'cancel' | 'menu' | 'none';
  quickReplies?: string[];
  menuCard?: BusinessMenuCard;
}

/**
 * Returns the official WhatsApp Business initial menu card
 */
export function getInitialMenuCard(): BusinessMenuCard {
  return {
    title: '🏥 Podo-Step Clínica Podológica',
    subtitle: 'Bienvenido a nuestro canal oficial de atención y citas podológicas.',
    items: [
      {
        id: '1',
        icon: '🦶',
        label: 'Agendar Cita Podológica',
        description: 'Elige tu servicio, fecha y horario disponible en segundos.',
        actionPayload: 'Agendar cita podológica',
      },
      {
        id: '2',
        icon: '📋',
        label: 'Servicios y Precios',
        description: 'Quiropodia, uña encarnada, pie diabético, plantillas y más.',
        actionPayload: 'Ver servicios y precios',
      },
      {
        id: '3',
        icon: '📍',
        label: 'Ubicación y Horarios',
        description: 'Dirección de la clínica, mapa y horarios de atención.',
        actionPayload: 'Ver ubicación y horarios',
      },
      {
        id: '4',
        icon: '❓',
        label: 'Preguntas Frecuentes',
        description: 'Recomendaciones previas a tu cita y formas de pago.',
        actionPayload: 'Preguntas frecuentes',
      },
      {
        id: '5',
        icon: '👨‍⚕️',
        label: 'Hablar con un Especialista',
        description: 'Consulta directa sobre molestias o casos específicos.',
        actionPayload: 'Hablar con un especialista',
      },
    ],
  };
}

/**
 * Intelligent Podo-Step Bot NLP engine
 */
export function processPodoStepMessage(
  userText: string,
  pendingBooking?: AppointmentBooking | null,
  patientName: string = 'Paciente'
): BotProcessResult {
  const textLower = userText.toLowerCase().trim();

  // 1. Initial Menu request
  if (
    textLower === 'menu' ||
    textLower === 'menú' ||
    textLower.includes('menu principal') ||
    textLower.includes('opciones') ||
    textLower.includes('inicio')
  ) {
    return {
      replyText: `¡Hola! 👋 Te presentamos nuestro menú principal de atención en *Podo-Step Clínica Podológica*.\n\nPor favor selecciona una opción o escríbeme lo que necesitas:`,
      menuCard: getInitialMenuCard(),
      quickReplies: ['🦶 Agendar cita', '📋 Ver servicios', '📍 Ubicación', '❓ Preguntas frecuentes'],
      action: 'menu',
    };
  }

  // 2. Services and pricing catalog
  if (
    textLower.includes('servicio') ||
    textLower.includes('precio') ||
    textLower.includes('costo') ||
    textLower.includes('cuanto cuesta') ||
    textLower.includes('cuánto cuesta') ||
    textLower.includes('catalogo')
  ) {
    let servicesText = `📋 *Catálogo de Servicios Podológicos - Podo-Step:*\n\n`;
    PODIATRY_SERVICES.forEach((s) => {
      servicesText += `• *${s.name}* (${s.durationMinutes} min) - *${s.price}*\n  _${s.description}_\n\n`;
    });
    servicesText += `¿Deseas agendar alguno de estos tratamientos para cuidar la salud de tus pies? 👣`;

    return {
      replyText: servicesText,
      quickReplies: [
        '🦶 Agendar Quiropodia',
        '🦶 Agendar Uña Encarnada',
        '🦶 Agendar Estudio de Pisada',
        '📍 Ver ubicación',
      ],
      action: 'none',
    };
  }

  // 3. Location and working hours
  if (
    textLower.includes('ubicacion') ||
    textLower.includes('ubicación') ||
    textLower.includes('direccion') ||
    textLower.includes('dirección') ||
    textLower.includes('donde estan') ||
    textLower.includes('dónde están') ||
    textLower.includes('horario') ||
    textLower.includes('telefono') ||
    textLower.includes('teléfono')
  ) {
    const locText = `📍 *Ubicación y Horarios de Podo-Step:*\n\n` +
      `🏢 *Dirección:* ${CLINIC_INFO.address}\n` +
      `🕒 *Horarios:* ${CLINIC_INFO.workingHours}\n` +
      `📞 *Teléfono de atención:* ${CLINIC_INFO.phone}\n\n` +
      `🚗 Contamos con estacionamiento y elevador para tu comodidad y accesibilidad.\n\n` +
      `¿Te gustaría agendar una cita para esta semana?`;

    return {
      replyText: locText,
      quickReplies: ['🦶 Agendar Cita', '📋 Ver Servicios', 'Ver Disponibilidad'],
      action: 'none',
    };
  }

  // 4. FAQ
  if (
    textLower.includes('pregunta') ||
    textLower.includes('faq') ||
    textLower.includes('duda') ||
    textLower.includes('como llegar') ||
    textLower.includes('pago') ||
    textLower.includes('tarjeta')
  ) {
    const faqText = `❓ *Preguntas Frecuentes - Podo-Step:*\n\n` +
      `💳 *Formas de pago:* Aceptamos efectivo, tarjetas de débito/crédito y transferencias SPEI.\n\n` +
      `🚿 *Preparación:* Te sugerimos asistir con los pies limpios y calzado cómodo. No es necesario cortar tus uñas previamente; nuestro podólogo profesional se encargará.\n\n` +
      `⏱️ *Puntualidad:* Recomendamos llegar 5-10 minutos antes de tu cita.\n\n` +
      `¿Podemos apoyarte agendando tu valoración?`;

    return {
      replyText: faqText,
      quickReplies: ['🦶 Agendar Cita', '📋 Ver Servicios y Precios', 'Hablar con Especialista'],
      action: 'none',
    };
  }

  // 5. Specialist request
  if (
    textLower.includes('especialista') ||
    textLower.includes('doctor') ||
    textLower.includes('podologo') ||
    textLower.includes('podólogo') ||
    textLower.includes('humano') ||
    textLower.includes('asesor')
  ) {
    return {
      replyText: `👨‍⚕️ Con gusto te canalizo con uno de nuestros podólogos especialistas en clínica.\n\nUn especialista de guardia revisará tu mensaje en breve durante nuestro horario de atención (${CLINIC_INFO.workingHours}).\n\nSi presentas dolor agudo o uña encarnada, te recomendamos apartar tu cita de urgencia para hoy o mañana. 👇`,
      quickReplies: ['🦶 Agendar Uña Encarnada Hoy', '🦶 Agendar Quiropodia Mañana', 'Ver menú'],
      action: 'none',
    };
  }

  // 6. Confirmation of pending booking
  if (
    pendingBooking &&
    (textLower.includes('confirm') ||
      textLower.includes('sí') ||
      textLower.includes('si') ||
      textLower.includes('perfecto') ||
      textLower.includes('de acuerdo') ||
      textLower.includes('adelante') ||
      textLower.includes('apartar') ||
      textLower.includes('ok'))
  ) {
    const confirmed: AppointmentBooking = {
      ...pendingBooking,
      status: 'confirmed',
      patientName: patientName || 'Paciente Podo-Step',
      googleCalendarUrl: buildGoogleCalendarUrl({
        ...pendingBooking,
        status: 'confirmed',
        patientName: patientName || 'Paciente Podo-Step',
      }),
    };

    return {
      replyText: `✅ *¡Tu cita podológica ha sido confirmada con éxito!*\n\n` +
        `🎫 *Folio de cita:* #${confirmed.id}\n` +
        `🦶 *Tratamiento:* ${confirmed.serviceName}\n` +
        `📅 *Fecha:* ${formatDateSpanish(confirmed.date)}\n` +
        `⏰ *Horario:* ${formatTimeSpanish(confirmed.time)} (${confirmed.durationMinutes} min)\n` +
        `📍 *Lugar:* ${confirmed.clinicLocation}\n\n` +
        `Te esperamos en clínica con todo el material estéril preparado. Si deseas guardar un recordatorio en tu teléfono, puedes usar el botón de Google Calendar o descargar el archivo .ics abajo. 👇`,
      appointment: confirmed,
      action: 'confirm',
      quickReplies: ['📋 Ver recomendaciones previas', '📍 Cómo llegar a la clínica', 'Menú principal'],
    };
  }

  // 7. Cancellation intent
  if (
    textLower.includes('cancel') ||
    textLower.includes('anular') ||
    textLower.includes('ya no quiero')
  ) {
    return {
      replyText: `Tu solicitud ha sido cancelada sin penalización. En *Podo-Step* estamos para cuidar de tus pasos cuando lo necesites. ¡Que tengas un excelente día! 🦶✨`,
      action: 'cancel',
      quickReplies: ['🦶 Agendar en otro horario', '📋 Ver servicios', 'Menú principal'],
    };
  }

  // 8. Service specific triggers
  let matchedService = PODIATRY_SERVICES.find((s) =>
    textLower.includes(s.name.toLowerCase()) ||
    textLower.includes(s.id) ||
    (s.id === 'una-encarnada' && (textLower.includes('uña') || textLower.includes('encarnad') || textLower.includes('dolor'))) ||
    (s.id === 'quiropodia' && (textLower.includes('quiropodia') || textLower.includes('callos') || textLower.includes('dureza') || textLower.includes('corte'))) ||
    (s.id === 'pie-diabetico' && (textLower.includes('diabet') || textLower.includes('diabético'))) ||
    (s.id === 'estudio-pisada' && (textLower.includes('pisada') || textLower.includes('plantilla') || textLower.includes('marcha'))) ||
    (s.id === 'onicomicosis' && (textLower.includes('hongo') || textLower.includes('onicomicosis'))) ||
    (s.id === 'verruga-plantar' && (textLower.includes('verruga') || textLower.includes('papiloma') || textLower.includes('ojo de pescado')))
  );

  // 9. Appointment scheduling intent
  const isSchedulingIntent =
    textLower.includes('agenda') ||
    textLower.includes('agendar') ||
    textLower.includes('cita') ||
    textLower.includes('apartar') ||
    textLower.includes('consulta') ||
    textLower.includes('turno') ||
    matchedService !== undefined;

  if (isSchedulingIntent) {
    const selectedService = matchedService || PODIATRY_SERVICES[0]; // Default Quiropodia
    const parsed = parseDateAndTime(textLower);

    const booking: AppointmentBooking = {
      id: 'PS-' + Math.floor(10000 + Math.random() * 90000),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: parsed.date,
      time: parsed.time,
      durationMinutes: selectedService.durationMinutes,
      patientName: patientName || 'Paciente',
      status: 'draft',
      clinicLocation: CLINIC_INFO.address,
      notes: `Solicitado en WhatsApp: "${userText}"`,
      createdAt: new Date().toISOString(),
    };
    booking.googleCalendarUrl = buildGoogleCalendarUrl(booking);

    return {
      replyText: `🦶 *Propuesta de Cita Podológica en Podo-Step:*\n\n` +
        `• *Servicio:* ${selectedService.name} (${selectedService.price})\n` +
        `• *Fecha:* ${formatDateSpanish(parsed.date)}\n` +
        `• *Horario sugerido:* ${formatTimeSpanish(parsed.time)} (${selectedService.durationMinutes} min)\n` +
        `• *Ubicación:* ${CLINIC_INFO.address}\n\n` +
        `¿Deseas que confirmemos esta cita para ti ahora mismo?`,
      appointment: booking,
      action: 'suggest',
      quickReplies: ['✅ Sí, confirmar cita', '🔄 Cambiar fecha u horario', '📋 Elegir otro servicio', 'Cancelar'],
    };
  }

  // 10. Greetings
  if (
    textLower.includes('hola') ||
    textLower.includes('buenos dias') ||
    textLower.includes('buenos días') ||
    textLower.includes('buenas tardes') ||
    textLower.includes('saludos')
  ) {
    return {
      replyText: `¡Hola! 👋 Te damos la bienvenida a *Podo-Step Clínica Podológica* (Cuenta Oficial Verificada).\n\nSomos especialistas en salud y bienestar del pie. ¿Cómo podemos ayudarte el día de hoy?`,
      menuCard: getInitialMenuCard(),
      quickReplies: ['🦶 Agendar Cita', '📋 Servicios y Precios', '📍 Ubicación y Horarios', 'Menú'],
      action: 'menu',
    };
  }

  // Fallback
  return {
    replyText: `Gracias por contactar a *Podo-Step Clínica Podológica*. 👣\n\nPuedo ayudarte a:\n• 🦶 *Agendar tu cita podológica* al instante\n• 📋 *Consultar servicios y costos* (quiropodia, uña encarnada, pie diabético, etc.)\n• 📍 *Ver dirección y horarios de atención*\n\n¿Qué te gustaría realizar?`,
    quickReplies: ['🦶 Agendar cita', '📋 Ver servicios y precios', 'Menú principal'],
    action: 'none',
  };
}

function parseDateAndTime(text: string): { date: string; time: string } {
  const now = new Date();
  let targetDate = new Date(now);
  let timeStr = '11:00'; // Default convenient clinic morning slot

  if (text.includes('hoy')) {
    // today
    timeStr = '16:00';
  } else if (text.includes('pasado mañana')) {
    targetDate.setDate(targetDate.getDate() + 2);
  } else if (text.includes('mañana')) {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (text.includes('viernes')) {
    targetDate = getNextDayOfWeek(now, 5);
  } else if (text.includes('lunes')) {
    targetDate = getNextDayOfWeek(now, 1);
  } else if (text.includes('martes')) {
    targetDate = getNextDayOfWeek(now, 2);
  } else if (text.includes('miércoles') || text.includes('miercoles')) {
    targetDate = getNextDayOfWeek(now, 3);
  } else if (text.includes('jueves')) {
    targetDate = getNextDayOfWeek(now, 4);
  } else if (text.includes('sábado') || text.includes('sabado')) {
    targetDate = getNextDayOfWeek(now, 6);
  } else {
    // Tomorrow by default
    targetDate.setDate(targetDate.getDate() + 1);
  }

  // Parse time
  const timeRegex = /(?:a las|a la|las)?\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.|de la tarde|de la mañana)?/i;
  const match = text.match(timeRegex);

  if (match && match[1]) {
    let hour = parseInt(match[1], 10);
    const minute = match[2] ? match[2] : '00';
    const modifier = (match[3] || '').toLowerCase();

    if (modifier.includes('pm') || modifier.includes('p.m.') || modifier.includes('tarde')) {
      if (hour < 12) hour += 12;
    } else if (modifier.includes('am') || modifier.includes('a.m.') || modifier.includes('mañana')) {
      if (hour === 12) hour = 0;
    } else if (hour >= 1 && hour <= 6) {
      hour += 12; // Afternoon assumption
    }

    // Keep clinic hours 9 to 19
    if (hour < 9) hour = 10;
    if (hour > 19) hour = 17;

    timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${targetDate.getFullYear()}-${pad(targetDate.getMonth() + 1)}-${pad(targetDate.getDate())}`;

  return { date: dateStr, time: timeStr };
}

function getNextDayOfWeek(date: Date, dayOfWeek: number): Date {
  const result = new Date(date);
  const currentDay = result.getDay();
  let distance = dayOfWeek - currentDay;
  if (distance <= 0) {
    distance += 7;
  }
  result.setDate(result.getDate() + distance);
  return result;
}
