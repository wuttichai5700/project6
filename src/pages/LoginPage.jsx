import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const baseURL = `${window.location.origin}/project/backend`;

      const res = await fetch(`${baseURL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', data.role); // ✅ เก็บ role
        localStorage.setItem('username', data.username); // ✅ เก็บชื่อผู้ใช้ (กรณีใช้แสดงผล)

        toast.success('🎉 เข้าสู่ระบบสำเร็จ');

        setTimeout(() => {
          if (data.role === 'admin.11411') {
            window.location.href = '/dashboard'; // 👉 ไปหน้าผู้ดูแลระบบ
          } else {
            window.location.href = '/appt/'; // 👉 ไปหน้าผู้ใช้งานทั่วไป
          }
        }, 1500);
      } else {
        toast.error(`❌ ${data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'}`);
      }
    } catch (error) {
      toast.error('⚠️ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleLogin}>
      <ToastContainer />
      <h2>เข้าสู่ระบบ</h2>

      <div className="field">
        <label>ชื่อผู้ใช้</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="กรอกชื่อผู้ใช้"
        />
      </div>

      <div className="field">
        <label>รหัสผ่าน</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="กรอกรหัสผ่าน"
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            style={{ cursor: 'pointer', marginLeft: 10 }}
          >
            {showPassword ? '🕵️‍♂️' : '👁️'}
          </span>
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  );
}

export default LoginForm;
