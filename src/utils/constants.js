export const API_ROOT = `http://127.0.0.1:8000/api`;
export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `JWT ${localStorage.getItem('token')}`
};
