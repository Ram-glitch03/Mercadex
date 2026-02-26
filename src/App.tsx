import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WholesalePortal from './pages/WholesalePortal';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/shop/*" element={<WholesalePortal />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
