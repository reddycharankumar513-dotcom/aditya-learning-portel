// Base API Client for ADITYA
import { handleMockApiRequest } from './mockApiHandler';

const API_BASE = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('aditya_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    // If Vercel or static hosting rewrites /api/* to index.html (text/html),
    // fallback gracefully to client-side simulated interactive backend
    if (!isJson) {
      console.info(`[ADITYA Network Notice] Endpoint ${endpoint} returned non-JSON (${contentType}). Falling back to client-side storage engine.`);
      return handleMockApiRequest<T>(endpoint, options);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.message || `Request failed with status ${response.status}`,
        data
      );
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error (e.g. backend server is not running on localhost or CORS failed)
    // Seamlessly fallback to mock API handler so the UI remains 100% functional
    console.info(`[ADITYA Network Fallback] Switching to client mock handler for ${endpoint}:`, error.message);
    try {
      return handleMockApiRequest<T>(endpoint, options);
    } catch (fallbackError: any) {
      if (fallbackError instanceof ApiError) {
        throw fallbackError;
      }
      throw new ApiError(500, fallbackError.message || 'Internal application error');
    }
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
