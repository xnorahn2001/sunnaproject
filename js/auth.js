// js/auth.js

var API_BASE_URL = 'http://localhost:5194/api';

var authService = {
    // دالة مساعدة لفك تشفير التوكن
    parseJwt(token) {
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    },

    async login(phoneOrCR, password) {
        const url = `${API_BASE_URL}/Auth/login`; 
        console.log("جاري إرسال طلب تسجيل الدخول إلى:", url);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify({
                PhoneOrCR: phoneOrCR, 
                Password: password  
            })
        });

        if (response.status === 404) {
             throw new Error("لم يتم العثور على الرابط. تأكدي من تشغيل السيرفر.");
        }

        if (!response.ok) {
            // محاولة قراءة الخطأ كنص في حال لم يكن JSON
            let errorMessage = 'بيانات الدخول غير صحيحة';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = await response.text() || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        // المتوقع أن الرد هو: { "Token": "eyJhbGciOiJIUzI1NiIsInR..." }

        if (data.Token) {
            // حفظ التوكن
            localStorage.setItem('token', data.Token);
            
            // فك التشفير واستخراج البيانات
            const decoded = this.parseJwt(data.Token);
            
            if (decoded) {
                // استخراج الدور (Role) والاسم
                // في .NET Claims، الدور يأتي غالباً باسم طويل
                const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                const name = decoded.FullName || decoded.unique_name;

                localStorage.setItem('userType', role);
                localStorage.setItem('userName', name);
                localStorage.setItem('userLoggedIn', 'true');

                // نرجع بيانات نظيفة للواجهة
                return {
                    token: data.Token,
                    userType: role,
                    name: name
                };
            }
        }

        return data;
    }
};