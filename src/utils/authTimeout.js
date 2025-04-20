// utils/authTimeout.js
export const checkAuthTimeout = () => {
  const loginTime = localStorage.getItem('loginTime');
  const now = Date.now();

  if (loginTime && now - parseInt(loginTime) > 8 * 60 * 60 * 1000) {
    alert('🕒 หมดเวลาการใช้งาน กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
};
