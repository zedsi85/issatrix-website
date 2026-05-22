const BASE = import.meta.env.VITE_API_URL || '';

export function getToken() {
  return localStorage.getItem('issatrix_admin_token');
}

export function setToken(token) {
  localStorage.setItem('issatrix_admin_token', token);
}

export function clearToken() {
  localStorage.removeItem('issatrix_admin_token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse(res) {
  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin/login';
    return;
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function apiGet(path) {
  return fetch(`${BASE}${path}`, { headers: authHeaders() }).then(handleResponse);
}

export function apiPost(path, body) {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  }).then(handleResponse);
}

export function apiPostNoAuth(path, body) {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(async (res) => {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed (${res.status})`);
    }
    return res.json();
  });
}

export function apiPatch(path, body) {
  return fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  }).then(handleResponse);
}
