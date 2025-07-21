import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// CSRF トークンの設定
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// 419エラー時の自動リトライ機能
let isRefreshing = false;

window.axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // 419エラー（Page Expired）の場合
        if (error.response?.status === 419 && !originalRequest._retry && !isRefreshing) {
            isRefreshing = true;
            originalRequest._retry = true;
            
            try {
                // CSRFトークンを再取得
                await window.axios.get('/sanctum/csrf-cookie');
                
                // 新しいCSRFトークンを設定
                const newToken = document.head.querySelector('meta[name="csrf-token"]');
                if (newToken) {
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken.content;
                    originalRequest.headers['X-CSRF-TOKEN'] = newToken.content;
                }
                
                isRefreshing = false;
                // 元のリクエストを再実行
                return window.axios(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                // CSRFトークン取得に失敗した場合はページをリロード
                console.warn('CSRF token refresh failed, reloading page...');
                window.location.reload();
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);
