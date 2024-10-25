const BASE_URLS: { [key: string]: string } = {
  development: 'http://192.168.43.120:8000/api',
  production: 'https://example.com/api',
};

const OPEN_WEATHER_API_KEY = '78d1ed34b6143ed4c18ed5658d7e1e58';

export const API_URL = BASE_URLS.development;

export const WEATHER_API_KEY = OPEN_WEATHER_API_KEY;
