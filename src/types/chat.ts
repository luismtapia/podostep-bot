export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  timeFormatted: string; // e.g. "10:36 a. m."
  status?: 'sent' | 'delivered' | 'read';
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions?: string[];
  isVoiceNote?: boolean;
  voiceDuration?: string;
  appointment?: AppointmentBooking;
  menuCard?: BusinessMenuCard;
  interactiveOptions?: InteractiveOption[];
}

export interface InteractiveOption {
  id: string;
  title: string;
  description?: string;
  actionText: string;
}

export interface BusinessMenuCard {
  title: string;
  subtitle: string;
  items: {
    id: string;
    icon: string;
    label: string;
    description: string;
    actionPayload: string;
  }[];
}

export interface PodiatryService {
  id: string;
  name: string;
  durationMinutes: number;
  price: string;
  description: string;
  popular?: boolean;
}

export interface AppointmentBooking {
  id: string;
  serviceId?: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  patientName: string;
  patientPhone?: string;
  notes?: string;
  status: 'draft' | 'confirmed' | 'cancelled';
  clinicLocation: string;
  googleCalendarUrl?: string;
  createdAt: string;
}

export interface BusinessContactInfo {
  name: string;
  avatar: string;
  phone: string;
  category: string;
  status: string;
  isOnline: boolean;
  isTyping: boolean;
  address: string;
  workingHours: string;
  isVerified: boolean;
}
