import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // رابط الباك أند المحلي
  const API_URL = 'http://localhost:5190/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,  // مهم: استخدام phoneNumber وليس email
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل عملية تسجيل الدخول');
      }

      // حفظ التوكن والبيانات في localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
        accountType: data.accountType
      }));
      
      // التوجه للصفحة الرئيسية أو Dashboard حسب نوع الحساب
      if (data.accountType === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/'); // أو أي صفحة أخرى
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ في تسجيل الدخول');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>تسجيل الدخول إلى منصة صناع</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>رقم الجوال:</label>
          <input 
            type="tel" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="05xxxxxxxx"
            required 
          />
        </div>
        <div>
          <label>كلمة المرور:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
      <p>
        ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
      </p>
    </div>
  );
};

export default Login;