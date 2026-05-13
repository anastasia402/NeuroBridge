import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email-ul nu este valid.';
    }

    // validare parola
    if (!formData.password.trim()) {
      newErrors.password = 'Parola este obligatorie.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Parola trebuie să aibă minim 8 caractere.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5294/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
          setErrors({
              server: (data.errors && data.errors.length > 0) ? data.errors[0] : 'Eroare la conectare.',
          });
          return;
      }

      const token = data.token;

      if (!token) {
        setErrors({ server: 'Serverul nu a trimis un token valid.' });
        return;
      }

      // decodare pt rol
      let roleFromServer = '';
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        
        roleFromServer = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role;
      } catch (e) {
        console.error("Eroare la decodarea token-ului:", e);
        setErrors({ server: 'Eroare la procesarea datelor de login.' });
        return;
      }

      if (!roleFromServer) {
        setErrors({ server: 'Rolul utilizatorului nu a fost găsit în token.' });
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', roleFromServer);
      
      const routes = {
        admin: '/admin/dashboard',
        mentor: '/mentor/dashboard',
        junior: '/dashboard'
      };

      const userRole = roleFromServer.toLowerCase();
      const dashboard = routes[userRole];

      if (!dashboard) {
        setErrors({ server: `Acces interzis: rolul "${roleFromServer}" nu are o rută configurată.` });
        return;
      }

      navigate(dashboard);

    } catch (error) {
      setErrors({
        server: 'Eroare de conexiune. Încearcă din nou.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12">
      <div className="max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-900 p-3 rounded-2xl text-white shadow-lg shadow-gray-200">
            <span className="text-2xl">⚡</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 mt-2 font-medium italic text-sm">Ready to continue your journey?</p>
          </div>

          {errors.server && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 font-medium text-center">
          {errors.server}
          </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                placeholder="alex@example.com"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white hover:bg-gray-800 py-4 rounded-2xl font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {isLoading ? 'Connecting...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 font-medium">
              New here?{' '}
              <Link to="/register" className="text-gray-900 font-bold hover:underline ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-10 text-sm text-gray-300 italic font-medium">
          "Small steps lead to big bridges."
        </p>
      </div>
    </div>
  );
};

export default Login;