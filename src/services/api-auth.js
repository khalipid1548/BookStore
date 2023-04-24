import axios from '../utils/axios-customize';

export const callRegister = (fullName, email, password, phone) => {
  return axios.post('/api/v1/user/register', {fullName, email, password, phone});
};

export const callLogin = (username, password) => {
  return axios.post('/api/v1/auth/login', {username, password});
};

export const callFetAccount = () => {
  return axios.get('/api/v1/auth/account');
}

export const callLogout = () => {
  return axios.post('/api/v1/auth/logout');
}

export const callUpdatePass = (email, oldpass, newpass) => {
  return axios.post('/api/v1/user/change-password', {email, oldpass, newpass});
};