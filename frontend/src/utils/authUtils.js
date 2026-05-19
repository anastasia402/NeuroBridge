export const getToken = () => {
  return localStorage.getItem('token');
};

export const getRole = () => {
  return localStorage.getItem('role');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/login';
};

export const setAuthData = (token, role) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
};

export const getUserId = () => {
  const id = localStorage.getItem('userId');
  return id ? parseInt(id, 10) : null;
};