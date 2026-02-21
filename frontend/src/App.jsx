import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import MathModelPage from './pages/MathModelPage';
import SimulationPage from './pages/SimulationPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/math" element={<MathModelPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
