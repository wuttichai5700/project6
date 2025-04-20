import React, { useState } from 'react';

function Registerlogin() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    phone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateUsername = (username) => {
    const pattern = /^[a-zA-Z0-9]+\.([0-9]{5})$/; // ตัวอย่าง: bank.11411
    return pattern.test(username);
  };

  const validatePassword = (password) => {
    return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateUsername(form.username)) {
      setMessage('❌ รูปแบบชื่อผู้ใช้ไม่ถูกต้อง (เช่น test.11xxx)');
      return;
    }

    if (!validatePassword(form.password)) {
      setMessage('❌ รหัสผ่านต้องมีอย่างน้อย 6 ตัว และมีทั้งตัวอักษรและตัวเลข');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage('❌ รหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    try {
      const baseURL = `${window.location.origin}/project/backend`;

      const res = await fetch(`${baseURL}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          fullname: form.fullname,
          phone: form.phone
        })
      });

      const result = await res.json();
      if (result.success) {
        setMessage('✅ ลงทะเบียนสำเร็จ โปรดรอยืนยัน');
        setForm({ username: '', password: '', confirmPassword: '', fullname: '', phone: '' });
      } else {
        setMessage('❌ ' + (result.message || 'ไม่สามารถลงทะเบียนได้'));
      }
    } catch {
      setMessage('❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>สมัครสมาชิก</h2>

      <div className="field">
        <label>ชื่อเต็ม</label>
        <input
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label>เบอร์โทรศัพท์</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label>ชื่อผู้ใช้ (เช่น test.11xxx)</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label>รหัสผ่าน</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(prev => !prev)}
            title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
          >
            {showPassword ? '🕵️‍♂️' : '👁️'}
          </span>
        </div>
      </div>

      <div className="field">
        <label>ยืนยันรหัสผ่าน</label>
        <div className="password-container">
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirm(prev => !prev)}
            title={showConfirm ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
          >
            {showConfirm ? '🕵️‍♂️' : '👁️'}
          </span>
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
      </button>

      {message && <p className="message">{message}</p>}
    </form>
  );
}

export default Registerlogin;
