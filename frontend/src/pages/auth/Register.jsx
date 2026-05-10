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
    role: 'user',
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({
            server: data.message || 'Eroare la înregistrare.',
          });
        }
        return;
      }

      // salvare JWT in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      // redirectionare in functie de rol
      const dashboard = data.role === 'junior' ? '/junior-dashboard' : '/mentor-dashboard';
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

        {/* Cardul principal cu colțuri rotunjite [3rem] */}
        <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Join the Bridge</h1>
            <p className="text-gray-500 mt-2 font-medium italic text-sm">Start building your neural pathways today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Nume */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                placeholder="Alex Johnson"
                required
              />
            </div>

            {/* Input Email */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                placeholder="alex@example.com"
                required
              />
            </div>

            {/* Select Rol */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                I am a...
              </label>
              <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer">
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
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                placeholder="Minim 8 characters"
                required
              />
            </div>

            {/* Butonul de Register (am folosit albastru pentru diferențiere, dar cu același stil) */}
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

        {/* Footer Text (identic cu cel de la Dashboard/Login) */}
        <p className="text-center mt-10 text-sm text-gray-300 italic font-medium">
          "Small steps lead to big bridges."
        </p>
      </div>
    </div>
  );
};

export default Register;