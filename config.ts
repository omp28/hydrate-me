const BASE_URLS: { [key: string]: string } = {
  development: 'http://192.168.43.120:8000/api',
  production: 'https://example.com/api',
};

export const API_URL = BASE_URLS.development;
