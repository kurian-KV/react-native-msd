import { isNetworkConnectivityAvailable } from '../utils/network';
import { getFromStorage } from '../utils/storage';
import type { InternalServerError, IValidationError } from './types';

const TIMEOUT_DURATION = 50000; // Timeout duration in milliseconds

export const apiCall = async (url: string, method: string, params?: object) => {
  try {
    const isConnectivityAvailable = await isNetworkConnectivityAvailable();
    if (!isConnectivityAvailable) {
      throw new Error(
        `{ status: 'ERR005', message: 'Internet connection unavailable.' }`
      );
    }
    const apiKey = await getFromStorage('MSD_API_KEY');
    const requestParam: {
      headers: HeadersInit_;
      method: string;
      body?: BodyInit_;
    } = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // TODO: Remove empty string, giving to avoid type error
        'x-api-key': apiKey || '',
      },
    };
    if (params) {
      requestParam.body = JSON.stringify(params);
    }
    const base_url = await getFromStorage('BASE_URL');
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT_DURATION);
    console.log('url:', `${base_url}/${url}`);
    console.log('apiKey:', apiKey);
    console.log('reqBody:', requestParam.body);
    const response = await fetch(`${base_url}/${url}`, {
      ...requestParam,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export type { InternalServerError, IValidationError };
