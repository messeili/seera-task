import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_GITHUB_API_URL;

// Create an instance of Axios
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // add bearer token to all requests
        const token = process.env.NEXT_PUBLIC_GITHUB_API_KEY;
        // attach base url to all requests
        config.url = `${baseUrl}${config.url}`;
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.Accept = 'application/vnd.github+json';
        config.headers['X-GitHub-Api-Version'] = '2022-11-28';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
