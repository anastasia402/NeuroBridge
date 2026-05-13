import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ROLE_ROUTES = {
  Junior: '/dashboard',
  Mentor: '/mentor/sessions',
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Junior',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Numele este obligatoriu.';
    if (!formData.email.trim()) newErrors.email = 'Email-ul este obligatoriu.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalid.';
    if (!formData.password.trim()) newErrors.password = 'Parola este obligatorie.';
    else if (formData.password.length < 8) newErrors.password = 'Minim 8 caractere.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Parolele nu se potrivesc.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...payload } = formData;

      const response = await fetch('http://localhost:5294/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ server: data.message || 'Eroare la înregistrare.' });
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('fullName', data.fullName);

      navigate(ROLE_ROUTES[data.role] ?? '/dashboard');
    } catch {
      setErrors({ server: 'Eroare de conexiune. Încearcă din nou.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12">
      <div className="max-w-md mx-auto w-full">
        <div className="flex justify-center mb-10">
          <div className="bg-gray-900 p-3 rounded-2xl text-white shadow-lg shadow-gray-200">
            <span className="text-2xl">⚡</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Join the Bridge</h1>
            <p className="text-gray-500 mt-2 font-medium italic text-sm">Start building your neural pathways today.</p>
          </div>

          {errors.server && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 text-center">
              {errors.server}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                placeholder="Alex Johnson"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-4">{errors.fullName}</p>}
            </div>

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
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-4">{errors.email}</p>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                I am a...
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="Junior">Junior</option>
                <option value="Mentor">Mentor</option>
              </select>
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
                placeholder="Minim 8 caractere"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-4">{errors.password}</p>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-4">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white hover:bg-gray-800 py-4 rounded-2xl font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {isLoading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 font-medium">
              Already a member?{' '}
              <Link to="/login" className="text-gray-900 font-bold hover:underline ml-1">
                Log in
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

export default Register;
