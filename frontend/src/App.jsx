import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage'; 
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';

const isAdminUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch (error) {
    return false;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/book/:vehicleId" element={<BookingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route
          path="/admin"
          element={isAdminUser() ? <AdminDashboard /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;