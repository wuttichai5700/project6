// App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';

import RegisterForm from './pages/RegisterForm';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import AppointmentPage from './pages/AppointmentPage';
import Registerlogin from './pages/Registerlogin';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = localStorage.getItem('role') === 'admin';

  return (
    <Router>
      {isAuthenticated && (
        <div className="top-bar">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('role');
              window.location.href = '/appt/';
            }}
          >
            ออกจากระบบ
          </button>
        </div>
      )}

      <Routes>
        <Route
          path="/dashboard"
          element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />}
        />

        <Route
          path="*"
          element={
            <div className="container">
              <nav className="navbar">
                {isAuthenticated ? (
                  <>
                    <Link to="/" className="nav-button">บันทึกการฉีดยา</Link>
                    <Link to="/search" className="nav-button">ค้นหาข้อมูล</Link>
                    <Link to="/appointment" className="nav-button">ลงทะเบียนนัดหมาย</Link>
                    {isAdmin && <Link to="/dashboard" className="nav-button">Dashboard</Link>}
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-button">เข้าสู่ระบบ</Link>
                    <Link to="/register-user" className="nav-button">สมัครสมาชิก</Link>
                  </>
                )}
              </nav>

              <Routes>
                <Route
                  path="/"
                  element={isAuthenticated ? <RegisterForm /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/search"
                  element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/appointment"
                  element={isAuthenticated ? <AppointmentPage /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/login"
                  element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
                />
                <Route
                  path="/register-user"
                  element={<Registerlogin />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;