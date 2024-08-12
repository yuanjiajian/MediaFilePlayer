// http.js
import axios from 'axios';
// 创建一个 axios 实例
const http = axios.create({
  baseURL: import.meta.env.BASE_API, // 设置请求的基础 URL
  timeout: 10000, // 设置请求超时时间
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data; // 直接返回数据
  },
  (error) => {
    // 对响应错误做点什么
    console.error('HTTP Error:', error);
    return Promise.reject(error);
  }
);

// 导出封装的 axios 实例
export default http;