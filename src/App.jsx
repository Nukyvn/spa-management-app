import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Intro from './components/Intro';
import Billing from './components/Billing';
import Management from './components/Management';
import CustomerManagement from './components/CustomerManagement';
import TechnicianManagement from './components/TechnicianManagement';
import Appointment from './components/Appointment';
import Inventory from './components/Inventory';
import Report from './components/Report';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          width: isCollapsed ? '50px' : '200px',
          backgroundColor: '#6d2077',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          transition: 'width 0.3s ease',
          zIndex: 1000,
          overflowX: 'hidden',
          textAlign: 'left',
        }}
      >
        <Sidebar navigate={navigate} toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      </div>
      <div
        style={{
          flexGrow: 1,
          marginLeft: isCollapsed ? '50px' : '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/management" element={<Management />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/technicians" element={<TechnicianManagement />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;