'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('medipredict_token');
}

// ==== Demo Mode (when backend is not running) ====

const DEMO_DISEASES: Record<string, { disease: string; precautions: string[]; exercises: string[]; tips: string[] }> = {
  default: {
    disease: 'Common Cold',
    precautions: ['Rest properly and stay at home', 'Stay hydrated — drink 8+ glasses of water', 'Avoid cold exposure and crowded places', 'Consult a doctor if symptoms worsen after 5 days'],
    exercises: ['Light breathing exercises', 'Gentle neck stretches', 'Short indoor walks'],
    tips: ['Eat vitamin-C rich foods like oranges', 'Gargle with warm salt water twice daily', 'Maintain 8 hours of sleep for recovery'],
  },
  fever: {
    disease: 'Influenza (Flu)',
    precautions: ['Rest and avoid strenuous activity', 'Take prescribed antipyretics to control fever', 'Isolate to prevent spreading', 'See a doctor if fever exceeds 103°F'],
    exercises: ['No exercise during high fever', 'Light breathing exercises when fever subsides', 'Gradual walking as you recover'],
    tips: ['Keep body covered and avoid drafts', 'Consume warm soups and broths', 'Monitor temperature every 4 hours'],
  },
  chest_pain: {
    disease: 'Cardiac Concern (Seek Immediate Care)',
    precautions: ['Seek emergency medical care immediately', 'Avoid physical exertion', 'Do not ignore chest pain — call emergency services', 'Take prescribed medication if available'],
    exercises: ['No exercise — rest completely', 'Deep breathing only when calm', 'Resume exercise only after medical clearance'],
    tips: ['Avoid caffeine and stimulants', 'Manage stress with calm breathing', 'Follow up with a cardiologist urgently'],
  },
};

interface DemoReport {
  _id: string;
  created_at: string;
  disease: string;
  confidence: number;
  precautions: string[];
  exercises: string[];
  tips: string[];
  symptoms: string[];
}

function demoPredict(symptoms: string[]) {
  const key = symptoms.find((s) => DEMO_DISEASES[s] !== undefined) || 'default';
  const result = DEMO_DISEASES[key] || DEMO_DISEASES.default;
  return {
    disease: result.disease,
    confidence: Math.floor(Math.random() * 20) + 78, // 78–97%
    precautions: result.precautions,
    exercises: result.exercises,
    tips: result.tips,
    symptoms,
  };
}

function demoRegister(name: string, email: string) {
  const fakeId = Math.random().toString(36).slice(2);
  const user = { id: fakeId, name, email };
  localStorage.setItem('medipredict_demo_users', JSON.stringify([
    ...JSON.parse(localStorage.getItem('medipredict_demo_users') || '[]'),
    { ...user, password: '' },
  ]));
  const token = 'demo_' + btoa(JSON.stringify(user));
  return { token, user };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function demoLogin(email: string, _password: string) {
  const users = JSON.parse(localStorage.getItem('medipredict_demo_users') || '[]');
  const user = users.find((u: { email: string }) => u.email === email);
  if (!user) throw new Error('No account found with this email. Please register first.');
  const token = 'demo_' + btoa(JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

function saveDemo(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadDemo<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || '') ?? fallback; } catch { return fallback; }
}

// ==== Fetch wrapper with demo fallback ====

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (res.status === 401 || res.status === 422) {
       // If we have a demo token and get an auth error, fallback to demo mode
       if (token?.startsWith('demo_')) throw new _DemoFallback();
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API error');
    return data;
  } catch (err: unknown) {
    if (err instanceof _DemoFallback) throw err;
    // Detect any fetch/network failure (backend not running)
    const isNetwork =
      err instanceof TypeError ||
      (err instanceof Error && (
        err.message.includes('fetch') ||
        err.message.includes('Failed') ||
        err.message.includes('NetworkError') ||
        err.message.includes('ECONNREFUSED') ||
        err.message.includes('network')
      ));
    if (!isNetwork) throw err; // Real API errors bubble up
    console.warn('[MediPredict] Backend unreachable — running in Demo Mode');
    throw new _DemoFallback();
  }
}

class _DemoFallback extends Error { constructor() { super('_demo_'); } }

export const api = {
  register: async (name: string, email: string, _password: string) => {
    try {
      return await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password: _password }) });
    } catch (e) {
      if (e instanceof _DemoFallback) return demoRegister(name, email);
      throw e;
    }
  },

  login: async (email: string, password: string) => {
    try {
      return await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    } catch (e) {
      if (e instanceof _DemoFallback) return demoLogin(email, password);
      throw e;
    }
  },

  getMe: async () => {
    try { return await apiFetch('/api/auth/me'); }
    catch (e) {
      if (e instanceof _DemoFallback) {
        const token = getToken() || '';
        const user = token.startsWith('demo_') ? JSON.parse(atob(token.slice(5))) : {};
        return { user };
      }
      throw e;
    }
  },

  predict: async (symptoms: string[]) => {
    try {
      return await apiFetch('/api/predict/', { method: 'POST', body: JSON.stringify({ symptoms }) });
    } catch (e) {
      if (e instanceof _DemoFallback) {
        const result = demoPredict(symptoms);
        // Save to demo reports
        const reports = loadDemo<DemoReport[]>('medipredict_demo_reports', []);
        const demoReport: DemoReport = { ...result, _id: Math.random().toString(36).slice(2), created_at: new Date().toISOString() };
        reports.unshift(demoReport);
        saveDemo('medipredict_demo_reports', reports);
        return { message: 'Prediction successful (Demo Mode)', result };
      }
      throw e;
    }
  },

  getReports: async () => {
    try { return await apiFetch('/api/reports/'); }
    catch (e) {
      if (e instanceof _DemoFallback) {
        return { reports: loadDemo('medipredict_demo_reports', []) };
      }
      throw e;
    }
  },

  chat: async (message: string) => {
    try {
      return await apiFetch('/api/chat/', { method: 'POST', body: JSON.stringify({ message }) });
    } catch (e) {
      if (e instanceof _DemoFallback) {
        // Medical mock response logic for demo mode
        const responses = [
          "In Demo Mode, I provide simulated responses. Based on current data, your health metrics are within normal ranges.",
          "I recommend checking the Symptom AI section for a full diagnosis.",
          "Drink plenty of water and rest. I'll be here if you need more assistance."
        ];
        return { 
          response: responses[Math.floor(Math.random() * responses.length)],
          sender: "MediAssist AI (Demo)"
        };
      }
      throw e;
    }
  },
};

export { getToken };
