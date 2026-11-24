import { apiRequest } from './api';

export function signup(payload) {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    body: payload,
  });
}

export function login(payload) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function logout() {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
    body: {},
  });
}

export function getCurrentUser() {
  return apiRequest('/api/auth/me');
}

export function refreshSession() {
  return apiRequest('/api/auth/refresh', {
    method: 'POST',
    body: {},
  });
}

export function forgotPassword(email) {
  return apiRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}
