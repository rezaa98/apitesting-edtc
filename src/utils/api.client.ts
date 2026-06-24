import axios from 'axios';
import * as dotenv from 'dotenv';
import { config } from '../config/api.config';

dotenv.config({ path: '.env.local' });

const instance = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'User-Agent': 'curl/8.7.1',
    'x-api-key': process.env.REQRES_API_KEY || ''
  },
  validateStatus: () => true,
});

const formatResponse = (response: any) => ({
  status: response.status,
  body: response.data,
  headers: response.headers
});

export const apiClient = {
  get: async (endpoint: string) => {
    const res = await instance.get(endpoint);
    return formatResponse(res);
  },
  post: async (endpoint: string, payload: object) => {
    const res = await instance.post(endpoint, payload);
    return formatResponse(res);
  },
  put: async (endpoint: string, payload: object) => {
    const res = await instance.put(endpoint, payload);
    return formatResponse(res);
  },
  delete: async (endpoint: string) => {
    const res = await instance.delete(endpoint);
    return formatResponse(res);
  },
};
