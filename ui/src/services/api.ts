import { API_URL } from '../constants/Config';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;

  // We extract headers to merge them properly
  const { headers: customHeaders, ...restOptions } = options;

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      Accept: 'application/json',
      ...customHeaders,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error: ${response.status}`);
  }

  return response.json();
};
