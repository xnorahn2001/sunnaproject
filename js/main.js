// ==================== SPLASH SCREEN HANDLER ==================== 
document.addEventListener('DOMContentLoaded', function() {
    handleSplashScreen(); 
    setupNavbarInteractions();
    setActiveNavLink();
    checkUserLogin(); // التحقق من حالة المستخدم عند تحميل الصفحة
});

function handleSplashScreen() {
    const body = document.body;
    const splashScreen = document.querySelector('.splash-screen');

    if (!splashScreen) return;

    // وقت الانتظار بالمللي ثانية (500ms = نصف ثانية)
    const loadingTime = 500; 

    setTimeout(() => {
        // إخفاء شاشة التحميل: ابدأ الانتقال إلى الشفافية
        splashScreen.style.opacity = '0';
        splashScreen.style.visibility = 'hidden';
        
        // **الخطوة الحاسمة:** إزالة الكلاس الذي يخفي محتوى الصفحة
        body.classList.remove('loading-state');
        
        // إزالة شاشة التحميل من الـ DOM بالكامل بعد انتهاء الانتقال (0.5 ثانية)
        setTimeout(() => {
            splashScreen.remove();
        }, 500); 
    }, loadingTime);
}

// ==================== NAVBAR & ACTIVE LINK SETUP ==================== 

function setupNavbarInteractions() {
    // 💡 تم إزالة الكود اليدوي للـ Hamburger Menu لأنه يتعارض مع Alpine.js
    
    // Set active nav link based on current page
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // يمكن إضافة هنا منطق إغلاق القائمة المنسدلة في الجوال إذا لم يتم التعامل معه بـ Alpine.js
            // مثال: if (window.innerWidth < 768) { closeAlpineMenu(); }
        });
    });
}

function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // الحصول على اسم الملف الحالي
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop(); // الحصول على اسم الملف من الرابط
        
        link.classList.remove('active');

        // تحقق من الروابط الداخلية (تبدأ بـ #) لتجاهلها هنا
        if (href && href.startsWith('#')) return; 

        // تفعيل الرابط إذا كان يطابق اسم الملف الحالي (أو مسار الصفحة الرئيسية)
        if (currentPath === href || (currentPath === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}


// ==================== FORM HANDLERS ==================== 
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // (يفترض أن التحقق التفصيلي يتم في ملف validation.js)
    if (!email || !password || !isValidEmail(email)) {
        showNotification('يرجى التحقق من البريد الإلكتروني وكلمة المرور', 'error');
        return;
    }

    // محاكاة التحقق من نوع المستخدم بناءً على البريد (لأغراض العرض التوضيحي)
    let userType = 'client';
    if (email.includes('factory')) {
        userType = 'factory';
    } else if (email.includes('designer')) {
        userType = 'designer';
    } else if (email.includes('company')) {
        userType = 'company';
    }

    // محاكاة تسجيل الدخول وتخزين المعلومات
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', 'المستخدم'); // اسم وهمي
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userType', userType);
    
    showNotification('تم تسجيل الدخول بنجاح!', 'success');

    // توجيه المستخدم إلى لوحة التحكم الصحيحة
    setTimeout(() => {
        let redirectPage = 'dashboard-client.html'; 
        if (userType === 'factory') {
            redirectPage = 'dashboard-factory.html';
        } else if (userType === 'designer') {
            redirectPage = 'dashboard-designer.html';
        } else if (userType === 'company') {
            redirectPage = 'dashboard-company.html';
        }
        window.location.href = redirectPage;
    }, 1000);
}

function handleRegister(event) {
    event.preventDefault();
    const userType = document.querySelector('input[name="userType"]:checked');
    const fullname = document.getElementById('fullname')?.value;
    const email = document.getElementById('reg-email')?.value;
    const password = document.getElementById('reg-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const terms = document.getElementById('terms')?.checked;

    // يفترض أن التحقق التفصيلي يتم في ملف validation.js
    if (!userType || !fullname || !email || !password || !confirmPassword || password !== confirmPassword || !terms) {
        showNotification('يرجى مراجعة الحقول والموافقة على الشروط', 'error');
        return;
    }

    showNotification('تم إنشاء الحساب بنجاح!', 'success');
    
    // Store user info
    localStorage.setItem('userName', fullname);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userType', userType.value);
    localStorage.setItem('userLoggedIn', 'true');
    
    // التوجيه إلى صفحة تسجيل الدخول بعد التسجيل
    setTimeout(() => {
        window.location.href = 'login.html'; 
    }, 1000);
}

function handleContact(event) {
    event.preventDefault();
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const subject = document.getElementById('subject')?.value;
    const message = document.getElementById('message')?.value;

    // يفترض أن التحقق التفصيلي يتم في ملف validation.js
    if (!name || !email || !subject || !message || !isValidEmail(email)) {
        showNotification('يرجى ملء جميع الحقول والتحقق من البريد', 'error');
        return;
    }

    showNotification('تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا', 'success');
    
    // Reset form
    event.target.reset();
}

// ==================== UTILITY FUNCTIONS ==================== 
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // تنسيق CSS للإشعارات (للتوضيح فقط، يجب أن يكون في ملف CSS)
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transform: translateX(400px);
        transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;

    if (type === 'success') {
        notification.style.backgroundColor = '#d1fae5';
        notification.style.color = '#065f46';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#fee2e2';
        notification.style.color = '#dc2626';
    } else {
        notification.style.backgroundColor = '#dbeafe';
        notification.style.color = '#0c4a6e';
    }

    document.body.appendChild(notification);

    // ظهور الإشعار
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);

    // اختفاء الإشعار
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function checkUserLogin() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const userName = localStorage.getItem('userName');
    
    if (isLoggedIn && userName) {
        console.log('مرحباً:', userName);
        // يمكنك إظهار زر "لوحة التحكم" بدلاً من "تسجيل الدخول" هنا
    }
}