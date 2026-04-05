import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Phone, Mail, Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthModal = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, register } = useContext(AuthContext);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setAuthError('');
      setIsLoginTab(true);
      setAuthForm({ name: '', email: '', password: '', phone: '' });
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      let userData;
      if (isLoginTab) {
        userData = await login(authForm.email, authForm.password);
      } else {
        userData = await register(authForm.name, authForm.email, authForm.password, authForm.phone);
      }
      setAuthModalOpen(false);
      
      // Strict Rubric Roll-Based Redirects
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Click overlay to close */}
      <div className="absolute inset-0" onClick={() => setAuthModalOpen(false)}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-t-brand animate-fade-up">
        {/* Close button */}
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Obvious tab toggles */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 mt-2">
          <button 
            type="button"
            onClick={() => { setIsLoginTab(true); setAuthError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLoginTab ? 'bg-white shadow text-brand' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsLoginTab(false); setAuthError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLoginTab ? 'bg-white shadow text-brand' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            {isLoginTab ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            {isLoginTab ? 'Enter your email and password to login.' : 'Register to easily place and track orders.'}
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-bold border border-red-100 text-center animate-shake">
            {authError}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isLoginTab && (
            <>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                <input required type="text" name="name" value={authForm.name} onChange={handleAuthChange} className="w-full bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl border-2 border-transparent focus:border-brand focus:bg-white outline-none transition-all text-sm font-medium text-gray-900" placeholder="Full Name" />
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                <input required type="tel" name="phone" value={authForm.phone} onChange={handleAuthChange} className="w-full bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl border-2 border-transparent focus:border-brand focus:bg-white outline-none transition-all text-sm font-medium text-gray-900" placeholder="Phone Number" />
              </div>
            </>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
            <input required type="email" name="email" value={authForm.email} onChange={handleAuthChange} className="w-full bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl border-2 border-transparent focus:border-brand focus:bg-white outline-none transition-all text-sm font-medium text-gray-900" placeholder="Email Address" />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
            <input required type="password" name="password" value={authForm.password} onChange={handleAuthChange} className="w-full bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl border-2 border-transparent focus:border-brand focus:bg-white outline-none transition-all text-sm font-medium text-gray-900" placeholder="Password" />
          </div>
          
          <button type="submit" disabled={authLoading} className="w-full btn-primary bg-accent hover:bg-gray-900 text-white font-bold py-4 mt-2 rounded-xl text-lg tracking-wide shadow-lg hover:shadow-accent/30 hover:-translate-y-1 transition-all flex justify-center items-center">
            {authLoading ? (
               <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin mr-2"></div>
            ) : null}
            {authLoading ? 'Verifying...' : (isLoginTab ? 'Login' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
