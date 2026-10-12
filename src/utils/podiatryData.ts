import { PodiatryService } from '../types/chat';

export const PODIATRY_SERVICES: PodiatryService[] = [
  {
    id: 'quiropodia',
    name: 'Quiropodia Integral',
    durationMinutes: 45,
    price: '$450 MXN',
    description: 'Corte terapéutico de uñas, deslaminado de durezas/callos, fresado e hidratación profunda.',
    popular: true,
  },
  {
    id: 'una-encarnada',
    name: 'Tratamiento de Uña Encarnada',
    durationMinutes: 40,
    price: '$500 MXN',
    description: 'Alivio inmediato del dolor mediante espiculotomía indolora y curación antiséptica.',
    popular: true,
  },
  {
    id: 'pie-diabetico',
    name: 'Pie Diabético (Cuidado Preventivo)',
    durationMinutes: 50,
    price: '$600 MXN',
    description: 'Exploración neurológica y vascular preventiva, quiropodia especializada y orientación.',
  },
  {
    id: 'estudio-pisada',
    name: 'Estudio Biomecánico de la Pisada',
    durationMinutes: 60,
    price: '$850 MXN',
    description: 'Análisis baropodométrico computarizado de marcha y prescripción de plantillas personalizadas.',
    popular: true,
  },
  {
    id: 'onicomicosis',
    name: 'Tratamiento de Hongos (Onicomicosis)',
    durationMinutes: 40,
    price: '$550 MXN',
    description: 'Desbridamiento mecánico del lecho ungueal y tratamiento antimicótico especializado.',
  },
  {
    id: 'verruga-plantar',
    name: 'Papilomas / Verrugas Plantares',
    durationMinutes: 35,
    price: '$480 MXN',
    description: 'Tratamiento seguro y controlado para la eliminación de papilomas plantares.',
  },
];

export const CLINIC_INFO = {
  name: 'Podo-Step Clínica Podológica',
  botName: 'Podo-Step bot',
  address: 'Av. Insurgentes Sur 1425, Consultorio 304, Col. Del Valle, CDMX',
  phone: '+52 55 8432 9900',
  workingHours: 'Lunes a Viernes de 9:00 a. m. a 7:00 p. m. | Sábados de 9:00 a. m. a 2:00 p. m.',
  cancellationPolicy: 'Puedes reagendar o cancelar con mínimo 2 horas de anticipación.',
};
