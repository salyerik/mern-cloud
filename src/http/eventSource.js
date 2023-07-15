import { API_URL } from '../utils/config';

export const eventSource = new EventSource(`${API_URL}/stream`);
