import axios from '../utils/axios-customize';

export const callFetchListBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};

export const callFetchBookById = (id) => {
  return axios.get(`/api/v1/book/${id}`);
};

export const callFetchCategory = () => {
  return axios.get(`/api/v1/database/category`);
};

export const callCreateBook = (mainText, author, category, price, quantity, sold, thumbnail, slider) => {
  return axios.post('/api/v1/book', {mainText, author, category, price, quantity, sold, thumbnail, slider});
};

export const callUpdateBook = (_id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
  return axios.put(`/api/v1/book/${_id}`, {thumbnail, slider, mainText, author, price, sold, quantity, category});
};

export const callDeleteBook = (_id) => {
  return axios.delete(`/api/v1/book/${_id}`);
};

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImg', fileImg);
  return axios({
    method: 'post',
    url: '/api/v1/file/upload',
    data: bodyFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'upload-type': 'book',
    },
  });
};
