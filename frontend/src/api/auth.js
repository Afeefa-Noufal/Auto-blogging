import axiosInstance from '../axiosInstance';

export const signup = (formData) => axiosInstance.post('/api/auth/signup', formData);
export const login = (formData) => axiosInstance.post('/api/auth/', formData);
export const resetPassword = (token, formData) => axiosInstance.post(`/api/auth/reset-password/${token}`, formData);

