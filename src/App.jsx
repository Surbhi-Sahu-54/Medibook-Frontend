import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctor/:doctorId" element={<DoctorProfile />} />
              <Route path="/setup-profile" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={ <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute> }/>
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/checkout/:doctorId" element={<ProtectedRoute allowedRoles={['PATIENT']}><Checkout /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
