import { getToken, logout } from '../utils/authUtils';

const BASE_URL = 'http://localhost:5294/api';

export function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  if (res.status === 401) {
    logout();
    return;
  }
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`HTTP ${res.status} — răspuns invalid de la server`);
  }
  if (!res.ok) throw new Error(data.message || data.error || data.details || `HTTP ${res.status}`);
  return data;
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  return handleResponse(res);
}

export async function apiGet(path) {
  return apiFetch(path);
}

export async function apiPost(path, body) {
  return apiFetch(path, { method: 'POST', body: JSON.stringify(body) });
}

export async function apiPut(path, body) {
  return apiFetch(path, { method: 'PUT', body: JSON.stringify(body) });
}

export async function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}

export async function apiUpload(path, formData) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return handleResponse(res);
}
