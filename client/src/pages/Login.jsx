import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/' + (redirect === '/' ? '' : redirect));
      }
    }
  }, [user, navigate, redirect]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password, formData.phone);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="card w-full max-w-md p-8 lg:p-12 border-t-4 border-t-brand">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200 text-sm text-center">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field pl-10" placeholder="Full Name" />
              </div>
            </div>
          )}
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field pl-10" placeholder="Email Address" />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} className="input-field pl-10" placeholder="Password" />
            </div>
          </div>

          {isRegister && (
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-10" placeholder="Phone Number" />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg mt-4">
            {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsRegister(!isRegister)} className="ml-2 font-bold text-brand hover:underline">
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
