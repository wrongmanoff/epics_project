const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(
  /\/$/,
  '',
);

export class ApiError extends Error {
  constructor(message, status = 500, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('network', 0);
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      data?.error || data?.message || 'request_failed',
      response.status,
      data,
    );
  }

  return data;
}

export { API_URL };
