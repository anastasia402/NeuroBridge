export const getToken = () => localStorage.getItem('token');
export const getRole  = () => localStorage.getItem('role');
export const getUserId   = () => localStorage.getItem('userId');
export const getUserName = () => localStorage.getItem('fullName') || 'User';

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('fullName');
  window.location.href = '/login';
};

export const setAuthData = (token, role) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
};