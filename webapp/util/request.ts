import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiError {
    code: number;
    message: string;
}

class ApiClient {
    private readonly axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 5000,
        });

        this.axiosInstance.interceptors.request.use(
            (config: any) => {
                // Modify the request config before sending
                // config.headers['Authorization'] = `Bearer ${token}`;
                return config;
            },
            (error: AxiosError) => {
                console.error('Request error:', error.message);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse<any>) => {
                const { code, message, data } = response.data;
                if (code !== 200) {
                    return Promise.reject({ code, message });
                }
                return data;
            },
            (error: AxiosError<ApiError>) => {
                console.error('Response error:', error.message);
                return Promise.reject(error.response?.data);
            }
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.get<any>(url, config);
        return response.data;
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.post<any>(url, data, config);
        return response;
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.put<any>(url, data, config);
        return response.data;
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.delete<any>(url, config);
        return response.data;
    }
}

export default ApiClient;
