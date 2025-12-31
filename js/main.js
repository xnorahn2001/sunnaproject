import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Individual'); // القيمة الافتراضية
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // رابط الباك أند المحلي
  const API_URL = 'http://127.0.0.1:8080/api';

  const handleSubmit = async (e ) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fullName: name,        // تم التعديل ليتوافق مع الباك أند
          email: email, 
          password: password, 
          accountType: role      // تم التعديل ليتوافق مع الباك أند
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل عملية التسجيل');
      }

      // حفظ التوكن في حال النجاح
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      alert('تم إنشاء الحساب بنجاح!');
      navigate('/login'); // التوجه لصفحة تسجيل الدخول
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>إنشاء حساب جديد في منصة صناع</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>الاسم الكامل:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>البريد الإلكتروني:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
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
        <div>
          <label>نوع الحساب:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Individual">فرد (مصمم)</option>
            <option value="Facility">منشأة (مصنع)</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
        </button>
      </form>
      <p>
        لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
      </p>
    </div>
  );
};

export default Register;
