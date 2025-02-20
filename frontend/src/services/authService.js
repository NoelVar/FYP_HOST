const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';

class AuthService {
    static setAuth(token, userData) {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
    }

    static clearAuth() {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
    }

    static getToken() {
        return sessionStorage.getItem(TOKEN_KEY);
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static setupAxiosInterceptor(axios) {
        axios.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.clearAuth();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
}

export default AuthService; 