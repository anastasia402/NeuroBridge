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
    <div className="auth-container">
      <div className="auth-card">
        <h1>Înregistrare</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prenume</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ion"
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nume de familie</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Popescu"
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minim 8 caractere"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmare parolă</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repetă parola"
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'input-error' : ''}
            >
              <option value="junior">Junior</option>
              <option value="mentor">Mentor</option>
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          {errors.server && (
            <div className="error-alert">
              {errors.server}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Se înregistrează...' : 'Înregistrare'}
          </button>
        </form>

        <p className="auth-link">
          Ai deja cont? <Link to="/register">Conectează-te</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;