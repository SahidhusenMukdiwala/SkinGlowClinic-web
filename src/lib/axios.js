import axios from 'axios';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api').replace(/\/+$/, '') + '/';

const axiosServices = axios.create({
  baseURL: BASE_URL,
});

// ==============================|| AXIOS - REQUEST INTERCEPTOR ||============================== //

axiosServices.interceptors.request.use(
  (config) => {
    if (typeof window === 'undefined') return config;

    const token =
      localStorage.getItem('serviceToken') ||
      sessionStorage.getItem('serviceToken');

    const currentUserStr =
      localStorage.getItem('currentUser') ||
      sessionStorage.getItem('currentUser');

    let role = localStorage.getItem('role') || sessionStorage.getItem('role');

    if (!role && currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        role = String(currentUser.role);
      } catch (e) {
        // ignore parse error
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (role !== undefined && role !== null && role !== '') {
      config.headers['Role'] = role;
    }

    const platform = localStorage.getItem('platform') || sessionStorage.getItem('platform') || 'web';
    config.headers['platform'] = platform;

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================|| AXIOS - RESPONSE INTERCEPTOR ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Handle 403: Account deactivated by admin — force logout immediately
    if (error.response && error.response.status === 403) {
      const errMsg = error.response.data?.errors?.[0]?.message || error.response.data?.message || '';
      if (errMsg.toLowerCase().includes('deactivated')) {
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/admin/login?reason=deactivated';
        }
        return Promise.reject(error);
      }
    }

    // Handle 401 Unauthorized errors and attempt token refresh
    // DO NOT attempt refresh for login, refresh-token, or public registration requests
    const isAuthRequest =
      originalRequest.url?.includes('auth/login') ||
      originalRequest.url?.includes('auth/refresh-token') ||
      originalRequest.url?.includes('auth/signIn');

    if (error.response && error.response.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        if (typeof window === 'undefined') {
          return Promise.reject(error);
        }

        const refreshToken =
          localStorage.getItem('refreshToken') ||
          sessionStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('Refresh token not found');
        }

        // Call backend refresh-token endpoint
        const response = await axios.get(`${axiosServices.defaults.baseURL}auth/refresh-token`, {
          headers: {
            refreshtoken: refreshToken,
            'refresh-token': refreshToken,
          },
        });

        const newAccessToken =
          response.data?.data?.access_token ||
          response.data?.result?.data?.access_token ||
          response.data?.access_token;

        if (!newAccessToken) {
          throw new Error('Failed to obtain new access token');
        }

        // Store new access token in localStorage under serviceToken only
        localStorage.setItem('serviceToken', newAccessToken);

        // Update default header and original request header
        axiosServices.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request with the fresh token
        return axiosServices(originalRequest);
      } catch (refreshError) {
        console.error('Session expired or refresh token invalid. Logging out:', refreshError);

        if (typeof window !== 'undefined') {
          // Attempt graceful backend logout if possible
          try {
            const token = localStorage.getItem('serviceToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (token || refreshToken) {
              await axios.post(
                `${axiosServices.defaults.baseURL}auth/logout`,
                { refreshToken },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
              );
            }
          } catch (logoutError) {
            // Ignore logout API failure on expiry
          }

          // Clear credentials
          localStorage.removeItem('serviceToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          sessionStorage.clear();

          // Auto-redirect to admin login
          if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login?reason=expired';
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosServices;
