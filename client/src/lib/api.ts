import axios, { type AxiosRequestConfig } from 'axios';
import { env } from './env';
import type { ApiEnvelope } from './types';

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setApiTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

const api = axios.create({
  baseURL: env.backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

//* Attach the authentication token to every outgoing request.
api.interceptors.request.use(async config => {
  if (!tokenGetter) {
    return config;
  }

  const token = await tokenGetter();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//* Handle the error response from the API.
function getErrorMsg(error: unknown): string {
  /*
  Handle errors thrown by Axios.
  
  Typical Axios error shape:
  {
    message: 'Request failed',
    response: {
      data: {
        errors: [
          { message: 'Detailed error message' }
        ]
      }
    }
  }
  */
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'Unable to complete the request.'
    );
  }

  // Handle standard JavaScript errors.
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for unknown error types.
  return 'An unexpected error occurred.';
}

//* Sends a GET request and returns the response payload.
export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  try {
    const response = await api.get<ApiEnvelope<T>>(url, config);

    if (response.data.status === 'error') {
      throw new Error(response.data.errors?.[0]?.message || 'The request could not be processed.');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMsg(error), {
      cause: error,
    });
  }
}

//* Sends a POST request and returns the response payload.
export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
) {
  try {
    const response = await api.post<ApiEnvelope<TResponse>>(url, body, config);

    // Check whether the API responded with an application-level error.
    if (response.data.status === 'error') {
      throw new Error(response.data.errors?.[0]?.message || 'The request could not be processed.');
    }
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMsg(error), {
      cause: error,
    });
  }
}

//* Sends a PUT request and returns the response payload.
export async function apiPut<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
) {
  try {
    const response = await api.put<ApiEnvelope<TResponse>>(url, body, config);

    if (response.data.status === 'error') {
      throw new Error(response.data.errors?.[0]?.message || 'The request could not be processed.');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMsg(error), {
      cause: error,
    });
  }
}

//* Sends a DELETE request and returns the response payload.
export async function apiDelete<TResponse>(url: string, config?: AxiosRequestConfig) {
  try {
    const response = await api.delete<ApiEnvelope<TResponse>>(url, config);

    if (response.data.status === 'error') {
      throw new Error(response.data.errors?.[0]?.message || 'The request could not be processed.');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMsg(error), {
      cause: error,
    });
  }
}
