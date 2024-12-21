// src/components/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('อีเมลนี้มีผู้ใช้งานแล้ว');
          break;
        case 'auth/invalid-email':
          setError('รูปแบบอีเมลไม่ถูกต้อง');
          break;
        case 'auth/weak-password':
          setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
          break;
        case 'auth/user-not-found':
          setError('ไม่พบบัญชีผู้ใช้นี้');
          break;
        case 'auth/wrong-password':
          setError('รหัสผ่านไม่ถูกต้อง');
          break;
        default:
          setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{isRegistering ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}</h1>
          <p>Food Menu Management</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleEmailAuth} className="login-form">
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="กรอกอีเมลของคุณ"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="กรอกรหัสผ่านของคุณ"
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'กำลังดำเนินการ...' : (isRegistering ? 'ลงทะเบียน' : 'เข้าสู่ระบบ')}
          </button>
        </form>

        <p className="toggle-text">
          {isRegistering ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชี?'}
          <button
            type="button"
            className="toggle-button"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;