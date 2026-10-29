import type { AppState, Appointment, Conversation } from '../types';

export const DEMO_PROVIDERS: Record<string, string[]> = {
  'General Medicine': ['Dr. Ananya Sharma (Demo)', 'Dr. Rajesh Patel (Demo)'],
  Dermatology: ['Dr. Meera Iyer (Demo)', 'Dr. Kavita Nair (Demo)'],
  Pediatrics: ['Dr. Suresh Kumar (Demo)', 'Dr. Priya Menon (Demo)'],
  Cardiology: ['Dr. Arjun Reddy (Demo)', 'Dr. Sunita Desai (Demo)'],
  'Dental Care': ['Dr. Neha Gupta (Demo)', 'Dr. Vikram Singh (Demo)'],
};

export const SPECIALTIES = Object.keys(DEMO_PROVIDERS);

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function createSeedAppointments(): Appointment[] {
  return [
    {
      id: 'apt-1',
      purpose: 'Annual health check-up',
      specialty: 'General Medicine',
      provider: 'Dr. Ananya Sharma (Demo)',
      date: daysFromNow(5),
      time: '10:00',
      notes: 'Routine preventive visit',
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'apt-2',
      purpose: 'Skin consultation',
      specialty: 'Dermatology',
      provider: 'Dr. Meera Iyer (Demo)',
      date: daysFromNow(12),
      time: '15:00',
      notes: '',
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'apt-3',
      purpose: 'Follow-up discussion',
      specialty: 'General Medicine',
      provider: 'Dr. Rajesh Patel (Demo)',
      date: daysFromNow(-10),
      time: '11:00',
      notes: 'Completed demo appointment',
      status: 'completed',
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
  ];
}

export function createSeedConversations(): Conversation[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'conv-1',
      title: 'Cold vs Flu question',
      messages: [
        {
          id: 'msg-s1',
          role: 'user',
          content: 'What is the difference between a cold and the flu?',
          timestamp: now,
        },
        {
          id: 'msg-s2',
          role: 'assistant',
          content: 'The common cold and influenza are both respiratory illnesses but caused by different viruses. Colds usually develop gradually with milder symptoms. Flu often starts suddenly with higher fever and body aches. This is educational information only—not a diagnosis.',
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function createInitialState(): AppState {
  return {
    profile: {
      name: 'Demo User',
      email: 'demo.user@careconnect.ai',
    },
    conversations: createSeedConversations(),
    activeConversationId: 'conv-1',
    appointments: createSeedAppointments(),
    savedArticleIds: ['art-1', 'art-4'],
    checklist: null,
    settings: {
      demoMode: true,
      assistantName: 'CareConnect Assistant',
      reducedMotion: false,
      fontSize: 'normal',
      apiKey: '',
    },
  };
}

export const STORAGE_KEY = 'careconnect-ai-state-v1';
