import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Gateway } from '../store/useGatewayStore';

// Create an API client with TLS verification disabled
export const createApiClient = (gateway: Gateway): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: gateway.adminUrl,
    // Disable TLS verification for HTTPS connections
    httpsAgent: gateway.adminUrl.startsWith('https') && gateway.skipTlsVerify 
      ? new (require('https').Agent)({ rejectUnauthorized: false })
      : undefined,
  };

  // Add basic auth if credentials are provided
  if (gateway.username && gateway.password) {
    config.auth = {
      username: gateway.username,
      password: gateway.password,
    };
  }

  return axios.create(config);
};

// Helper for error handling
export const handleApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    return `API Error ${status}: ${data.message || JSON.stringify(data)}`;
  } else if (error.request) {
    // The request was made but no response was received
    return `Network Error: No response received. Check your connection and gateway settings.`;
  } else {
    // Something happened in setting up the request that triggered an Error
    return `Error: ${error.message}`;
  }
};
