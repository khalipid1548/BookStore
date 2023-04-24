import axios from '../utils/axios-customize';

export const callPlaceOrder = (data) => {
  return axios.post(`/api/v1/order`,{...data});
};


export const callHistoryOrder = () => {
  return axios.get(`/api/v1/order?current=1&pageSize=100`);
};