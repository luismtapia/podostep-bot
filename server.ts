import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Doctor's backend database for appointments (managed later in the doctor app)
interface DoctorAppointmentRecord {
  id: string;
  patientName: string;
  patientPhone?: string;
  serviceName: string;
  serviceId?: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

let clinicAppointmentsStore: DoctorAppointmentRecord[] = [
  {
    id: 'PS-10294',
    patientName: 'Carlos Mendoza',
    patientPhone: '+52 55 9812 3456',
    serviceName: 'Quiropodia Integral',
    date: '2026-10-13',
    time: '10:00',
    durationMinutes: 45,
    status: 'confirmed',
    notes: 'Paciente recurrente, corte de uñas y durezas plantares',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'PS-10295',
    patientName: 'María Elena Flores',
    patientPhone: '+52 55 6712 9012',
    serviceName: 'Tratamiento de Uña Encarnada',
    date: '2026-10-13',
    time: '12:00',
    durationMinutes: 40,
    status: 'confirmed',
    notes: 'Dolor en primer dedo del pie derecho',
    createdAt: new Date().toISOString(),
  },
];

// Backend API for doctor app integration (for doctor use in future app)
app.get('/api/appointments', (_req: Request, res: Response) => {
  res.json({ success: true, appointments: clinicAppointmentsStore });
});

// Patient bot booking endpoint: saves the confirmed appointment
app.post('/api/appointments', (req: Request, res: Response) => {
  const { appointment } = req.body;
  if (!appointment || !appointment.serviceName || !appointment.date) {
    res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
    return;
  }

  clinicAppointmentsStore.push({
    id: appointment.id || 'PS-' + Math.floor(10000 + Math.random() * 90000),
    patientName: appointment.patientName || 'Paciente',
    patientPhone: appointment.patientPhone || '',
    serviceName: appointment.serviceName,
    serviceId: appointment.serviceId,
    date: appointment.date,
    time: appointment.time,
    durationMinutes: appointment.durationMinutes || 45,
    status: 'confirmed',
    notes: appointment.notes || '',
    createdAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'Cita guardada en el sistema de la clínica',
    id: appointment.id,
  });
});

// AI Chatbot endpoint for Podo-Step bot
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Mensaje requerido' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.json({ fallback: true });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `Eres Podo-Step bot, el asistente oficial y verificado de WhatsApp de "Podo-Step Clínica Podológica".
Atiendes a pacientes que buscan atención para la salud de sus pies de forma profesional, cálida, clara y eficiente.
Servicios de la clínica:
1. Quiropodia Integral ($450 MXN, 45 min)
2. Tratamiento de Uña Encarnada / Onicocriptosis ($500 MXN, 40 min)
3. Pie Diabético - Cuidado Preventivo ($600 MXN, 50 min)
4. Estudio Biomecánico de la Pisada y Plantillas ($850 MXN, 60 min)
5. Tratamiento de Hongos / Onicomicosis ($550 MXN, 40 min)
6. Papilomas / Verrugas Plantares ($480 MXN, 35 min)

Dirección: Av. Insurgentes Sur 1425, Consultorio 304, Col. Del Valle, CDMX.
Horario: Lun-Vie 9:00 a 19:00, Sáb 9:00 a 14:00.

Tu objetivo:
1. Proporcionar el menú inicial y orientar al paciente con sus dudas.
2. Si el paciente desea agendar una cita, sugiere fecha y horario disponible dentro del horario de la clínica.
3. El paciente NO debe ver calendarios internos ni de otros pacientes, solo su propia cita.
4. Si detectas solicitud de agendamiento, añade al final de tu respuesta:
\`\`\`json
{
  "scheduleIntent": true,
  "serviceName": "...",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "durationMinutes": 45
}
\`\`\`
`;

    const chatContents = (history || []).slice(-6).map((h: { sender: string; text: string }) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    res.json({ success: true, text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.json({ fallback: true });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Podo-Step Bot Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
