import { API_URL } from './config';

export const eventSource = new EventSource(`${API_URL}/stream`);
