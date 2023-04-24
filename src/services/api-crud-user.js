import axios from '../utils/axios-customize';

export const callFetchListUser = (query) => {
  return axios.get(`/api/v1/user?${query}`);
};

export const callCreateUser = (fullName, email, password, phone) => {
  return axios.post('/api/v1/user', {fullName, email, password, phone});
};

export const callUpdateUser = (_id, fullName, phone, avatar) => {
  return axios.put('/api/v1/user', {_id, fullName, phone, avatar});
};

export const callDeleteUser = (_id) => {
  return axios.delete(`/api/v1/user/${_id}`);
};


export const callFetchdashboard = () => {
  return axios.get(`/api/v1/database/dashboard`);
};
