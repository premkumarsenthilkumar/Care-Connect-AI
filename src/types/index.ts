export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isEmergency?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  purpose: string;
  specialty: string;
  provider: string;
  date: string;
  time: string;
  notes: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  readingTime: number;
  source: string;
  sourceUrl?: string;
}

export interface Medication {
  id: string;
  name: string;
  category: string;
  commonUses: string;
  generalPrecautions: string;
  questionsForPharmacist: string[];
  source: string;
}

export interface VisitChecklist {
  id: string;
  mainConcern: string;
  symptomOnset: string;
  changesOverTime: string;
  currentMedications: string;
  knownAllergies: string;
  questionsForClinician: string;
  updatedAt: string;
}

export interface AppSettings {
  demoMode: boolean;
  assistantName: string;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large';
  apiKey?: string;
}

export interface AppState {
  profile: {
    name: string;
    email: string;
  };
  conversations: Conversation[];
  activeConversationId: string | null;
  appointments: Appointment[];
  savedArticleIds: string[];
  checklist: VisitChecklist | null;
  settings: AppSettings;
}
