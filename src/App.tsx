import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Appointments } from './pages/Appointments';
import { HealthLibrary } from './pages/HealthLibrary';
import { Medications } from './pages/Medications';
import { PatientSupport } from './pages/PatientSupport';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="library" element={<HealthLibrary />} />
            <Route path="medications" element={<Medications />} />
            <Route path="support" element={<PatientSupport />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
