import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Individual'); // القيمة الافتراضية
  const [commercialRegistration, setCommercialRegistration] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // رابط الباك أند المحلي
  const API_URL = 'http://localhost:5190/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // التحقق من السجل التجاري للمصانع
    if (role === 'Factory' && !commercialRegistration.trim()) {
      setError('السجل التجاري مطلوب للمصانع');
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        fullName: name,
        phoneNumber: phoneNumber,
        password: password,
        accountType: role
      };

      // إضافة السجل التجاري فقط للمصانع
      if (role === 'Factory') {
        requestBody.commercialRegistration = commercialRegistration;
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
      setError(err.message || 'حدث خطأ في التسجيل');
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
        <div>
          <label>نوع الحساب:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Individual">فرد (مصمم)</option>
            <option value="Factory">مصنع</option>
            <option value="Admin">مدير</option>
          </select>
        </div>
        
        {/* حقل السجل التجاري - يظهر فقط للمصانع */}
        {role === 'Factory' && (
          <div>
            <label>السجل التجاري:</label>
            <input 
              type="text" 
              value={commercialRegistration} 
              onChange={(e) => setCommercialRegistration(e.target.value)} 
              placeholder="أدخل رقم السجل التجاري"
              required
            />
          </div>
        )}
        
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
