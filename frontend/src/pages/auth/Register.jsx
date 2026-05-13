import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'junior',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // validare nume
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Numele de familie este obligatoriu.';
    }

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

    // validare confirmare parola
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmarea parolei este obligatorie.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu se potrivesc.';
    }

    // validare rol
    if (!formData.role) {
      newErrors.role = 'Selectează un rol';
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

  if (!validateForm()) return;

  setIsLoading(true);
  try {
    const payload = {
      email: formData.email,
      password: formData.password,
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      role: formData.role
    };

    const response = await fetch('http://localhost:5294/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Eroare la înregistrare.';

      if (data.errors) {
        const allErrors = Object.values(data.errors).flat();
        errorMessage = allErrors[0];
      } else if (data.message) {
        errorMessage = data.message;
      }

      setErrors({ server: errorMessage });
      return;
    }

    if (data.token) {
            localStorage.setItem('token', data.token);
            
            // decodare rol
            const base64Url = data.token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role;
            
            localStorage.setItem('role', role);

            // redirect la dashboard (daca este token)
            const dashboard = role.toLowerCase() === 'junior' ? '/dashboard' : '/mentor/dashboard';
            navigate(dashboard);
        } else {
            navigate('/login');
        }

  } catch (error) {
    setErrors({ server: 'Eroare de conexiune.' });
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

        <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Join the Bridge</h1>
            <p className="text-gray-500 mt-2 font-medium italic text-sm">Start building your neural pathways today.</p>
          </div>

          {errors.server && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 font-medium text-center">
          {errors.server}
          </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Prenume */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                placeholder="Alex"
              />
              {errors.firstName && <p className="text-red-500 text-[10px] mt-1 ml-4">{errors.firstName}</p>}
            </div>

            {/* Input Nume de familie */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                placeholder="Johnson"
              />
              {errors.lastName && <p className="text-red-500 text-[10px] mt-1 ml-4">{errors.lastName}</p>}
            </div>

            {/* Input Email */}
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
              {errors.email && <span className="text-red-500 text-xs ml-4">{errors.email}</span>}
            </div>

            {/* Selectare Rol */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                I am a...
              </label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer">
                <option value="junior">Junior</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>

            {/* Input Parola */}
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
                placeholder="Minim 8 characters"
                required
              />
              {errors.password && <span className="text-red-500 text-xs ml-4">{errors.password}</span>}
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
                placeholder="Re-type password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] mt-1 ml-4">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Register Button */}
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

        {/* Footer */}
        <p className="text-center mt-10 text-sm text-gray-300 italic font-medium">
          "Small steps lead to big bridges."
        </p>
      </div>
    </div>
  );
};

export default Register;