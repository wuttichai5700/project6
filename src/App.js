import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import '../styles/sb-admin-2.min.css';

// import หน้าต่าง ๆ
import AdminDashboard from './pages/AdminDashboard'; // ✅ แก้ path ตามโปรเจกต์คุณ
import Home from './pages/Home';                     // สมมุติว่าคุณมีหน้า Home
import Navbar from './components/Navbar';            // ถ้ามี navbar แยก

// ✨ Wrapper สำหรับเงื่อนไขซ่อน navbar
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/appt/dashboard";

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appt/dashboard" element={<AdminDashboard />} />
          {/* เพิ่มเส้นทางอื่น ๆ ได้ตามต้องการ */}
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
