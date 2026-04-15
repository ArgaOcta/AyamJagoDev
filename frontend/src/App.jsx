import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage'; 



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/book/:vehicleId" element={<BookingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;