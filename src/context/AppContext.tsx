import React, { createContext, useContext, useEffect, useReducer, useCallback, useRef } from 'react';
import type { AppState, Appointment, Conversation, Message, VisitChecklist } from '../types';
import { loadState, saveState, clearState } from '../utils/storage';
import { createMessage, generateAIResponse } from '../utils/chatEngine';

type Action =
  | { type: 'HYDRATE'; payload: AppState }
  | { type: 'RESET' }
  | { type: 'SET_ACTIVE_CONVERSATION'; id: string | null }
  | { type: 'NEW_CONVERSATION'; id?: string }
  | { type: 'DELETE_CONVERSATION'; id: string }
  | { type: 'RENAME_CONVERSATION'; id: string; title: string }
  | { type: 'ADD_MESSAGE'; conversationId: string; message: Message }
  | { type: 'CLEAR_CONVERSATION'; id: string }
  | { type: 'ADD_APPOINTMENT'; appointment: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; appointment: Appointment }
  | { type: 'CANCEL_APPOINTMENT'; id: string }
  | { type: 'TOGGLE_SAVED_ARTICLE'; id: string }
  | { type: 'SET_CHECKLIST'; checklist: VisitChecklist | null }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppState['settings']> }
  | { type: 'UPDATE_PROFILE'; profile: Partial<AppState['profile']> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'RESET':
      return clearState();
    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversationId: action.id };
    case 'NEW_CONVERSATION': {
      const id = action.id ?? `conv-${Date.now()}`;
      const conv: Conversation = {
        id,
        title: 'New conversation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        conversations: [conv, ...state.conversations],
        activeConversationId: id,
      };
    }
    case 'DELETE_CONVERSATION': {
      const remaining = state.conversations.filter((c) => c.id !== action.id);
      return {
        ...state,
        conversations: remaining,
        activeConversationId:
          state.activeConversationId === action.id
            ? remaining[0]?.id ?? null
            : state.activeConversationId,
      };
    }
    case 'RENAME_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.id ? { ...c, title: action.title } : c
        ),
      };
    case 'ADD_MESSAGE': {
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          if (c.id !== action.conversationId) return c;
          const messages = [...c.messages, action.message];
          const title =
            c.messages.length === 0 && action.message.role === 'user'
              ? action.message.content.slice(0, 40) + (action.message.content.length > 40 ? '…' : '')
              : c.title;
          return { ...c, messages, title, updatedAt: new Date().toISOString() };
        }),
      };
    }
    case 'CLEAR_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.id
            ? { ...c, messages: [], updatedAt: new Date().toISOString() }
            : c
        ),
      };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.appointment] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.appointment.id ? action.appointment : a
        ),
      };
    case 'CANCEL_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.id ? { ...a, status: 'cancelled' as const } : a
        ),
      };
    case 'TOGGLE_SAVED_ARTICLE': {
      const exists = state.savedArticleIds.includes(action.id);
      return {
        ...state,
        savedArticleIds: exists
          ? state.savedArticleIds.filter((id) => id !== action.id)
          : [...state.savedArticleIds, action.id],
      };
    }
    case 'SET_CHECKLIST':
      return { ...state, checklist: action.checklist };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.profile } };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  sendMessage: (text: string) => Promise<void>;
  isTyping: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null as unknown as AppState, () => loadState());
  const [isTyping, setIsTyping] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    dispatch({ type: 'HYDRATE', payload: loadState() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const sendMessage = useCallback(async (text: string) => {
    let convId = stateRef.current.activeConversationId;
    if (!convId) {
      convId = `conv-${Date.now()}`;
      dispatch({ type: 'NEW_CONVERSATION', id: convId });
    }

    const userMsg = createMessage('user', text);
    dispatch({ type: 'ADD_MESSAGE', conversationId: convId, message: userMsg });

    setIsTyping(true);
    if (stateRef.current.settings.demoMode) {
      await new Promise((r) => setTimeout(r, 450 + Math.random() * 500));
    }

    const { content, isEmergency } = await generateAIResponse(text, {
      demoMode: stateRef.current.settings.demoMode,
      apiKey: stateRef.current.settings.apiKey,
    });
    const assistantMsg = createMessage('assistant', content, isEmergency);
    dispatch({ type: 'ADD_MESSAGE', conversationId: convId!, message: assistantMsg });
    setIsTyping(false);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FA]">
        <div className="text-[#667085]">Loading CareConnect AI…</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch, sendMessage, isTyping }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
