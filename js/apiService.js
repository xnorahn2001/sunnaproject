// js/apiService.js
const BASE_URL = 'http://localhost:5000/api';

const apiService = {
    async request(endpoint, method = 'GET', body = null, isQueryParam = false) {
        const token = localStorage.getItem('token');
        let url = `${BASE_URL}${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        // التعامل مع Query Params (لعملية التسجيل) أو JSON Body (لعملية الدخول)
        if (body && !isQueryParam) {
            options.body = JSON.stringify(body);
        } else if (body && isQueryParam) {
            const params = new URLSearchParams(body).toString();
            url = `${url}?${params}`;
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'حدث خطأ ما');
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

export default apiService;