import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResidentPage from './pages/ResidentPage';
import './index.css';

function ScrollRestorer() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (state && typeof state === 'object' && 'scrollTo' in state) {
      const id = (state as { scrollTo: string }).scrollTo;
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, state]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollRestorer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resident/:slug" element={<ResidentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
