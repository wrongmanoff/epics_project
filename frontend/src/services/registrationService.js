/** Registration profile API calls. */

import { apiRequest } from './api';

export async function getRegistrationProfile() {
  return apiRequest('/api/registration/profile');
}

export async function createRegistrationProfile(payload) {
  return apiRequest('/api/registration/profile', {
    method: 'POST',
    body: payload,
  });
}

export async function updateRegistrationProfile(payload) {
  return apiRequest('/api/registration/profile', {
    method: 'PUT',
    body: payload,
  });
}
