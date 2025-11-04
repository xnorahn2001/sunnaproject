// ==================== DASHBOARD INITIALIZATION & Core Setup ==================== 
document.addEventListener('DOMContentLoaded', function() {
    // 1. إعداد لوحة التحكم الأولية
    initializeDashboard();
    
    // 2. إعداد مستمعي قائمة الشريط الجانبي
    setupSidebarMenuListeners();
    
    // 3. التحقق من حالة الدخول
    checkUserAuthentication();
});

function initializeDashboard() {
    // الحصول على معلومات المستخدم
    const userName = localStorage.getItem('userName') || 'المستخدم';
    const userType = localStorage.getItem('userType') || 'user';
    
    // تحديث ترويسة لوحة التحكم باسم المستخدم
    const dashboardHeader = document.querySelector('.dashboard-header h1');
    if (dashboardHeader) {
        // يتم استخدام أول كلمة قبل الفراغ للتأكد من استخدام اسم الشخص الأول فقط في الترحيب إذا لزم الأمر
        dashboardHeader.textContent = `مرحباً، ${userName.split(' ')[0]}`;
    }

    // لغرض التصحيح
    console.log('لوحة التحكم جاهزة للمستخدم:', userType); 
}

function setupSidebarMenuListeners() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // إزالة حالة النشط من جميع العناصر
            menuItems.forEach(m => m.classList.remove('active'));
            
            // إضافة حالة النشط للعنصر المضغوط
            this.classList.add('active');

            // 💡 ملاحظة: عند استخدام Alpine.js لإغلاق القائمة في الجوال، قد تحتاج لاستدعاء دالة Alpine هنا.
            // مثال: Alpine.store('sidebarOpen', false); 
            
            console.log('تم الضغط على:', this.textContent.trim());
        });
    });

    // تعيين أول عنصر كـ نشط افتراضياً
    if (menuItems.length > 0) {
        menuItems[0].classList.add('active');
    }
    
    // إضافة مستمع لزر تسجيل الخروج
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

function checkUserAuthentication() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    
    if (!isLoggedIn) {
        // التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مصادقاً
        window.location.href = 'login.html';
        return;
    }
}

// ==================== LOGOUT FUNCTIONALITY ==================== 
function handleLogout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        // مسح بيانات المستخدم
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        
        // التوجيه إلى الصفحة الرئيسية
        // استخدام مسار نسبي للخروج من مجلد لوحات التحكم
        window.location.href = '../index.html'; 
    }
}


// ==================== PROJECT & PROGRESS TRACKING ==================== 
function handleProjectDetail(projectId) {
    console.log('عرض تفاصيل المشروع:', projectId);
    // يمكن التوجيه هنا إلى صفحة: window.location.href = `project-detail.html?id=${projectId}`;
}

function updateProjectProgress(projectId, percentage) {
    const progressFill = document.querySelector(`[data-project-id="${projectId}"] .progress-fill`);
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        console.log(`تم تحديث تقدم المشروع ${projectId} إلى ${percentage}%`);
        showNotification(`تم تحديث تقدم المشروع إلى ${percentage}%`, 'success');
    }
}


// ==================== NOTIFICATIONS & UI ==================== 
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // تنسيق CSS أساسي للإشعارات (يجب إضافة @keyframes slideIn/slideOut في ملف CSS العام)
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        transform: translateY(-20px);
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;

    if (type === 'success') {
        notification.style.backgroundColor = '#d1fae5'; // خفيف
        notification.style.color = '#065f46'; // داكن
    } else if (type === 'error') {
        notification.style.backgroundColor = '#fee2e2'; 
        notification.style.color = '#dc2626';
    } else { // info
        notification.style.backgroundColor = '#dbeafe';
        notification.style.color = '#0c4a6e';
    }

    document.body.appendChild(notification);

    // ظهور الإشعار
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // اختفاء الإشعار
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== SESSION/CONSULTATION HANDLERS ==================== 
function scheduleConsultation(consultantId) {
    console.log('جدولة استشارة مع:', consultantId);
    // هنا يتم إرسال الطلب إلى الواجهة الخلفية
    showNotification('تم إرسال طلب الاستشارة بنجاح', 'success');
}

function cancelSession(sessionId) {
    if (confirm('هل تريد إلغاء هذه الجلسة؟')) {
        console.log('إلغاء الجلسة:', sessionId);
        // إرسال طلب الإلغاء
        showNotification('تم إلغاء الجلسة', 'success');
    }
}

function rescheduleSession(sessionId) {
    console.log('إعادة جدولة الجلسة:', sessionId);
    // فتح نموذج/نافذة لإعادة الجدولة
    showNotification('تم فتح نموذج إعادة الجدولة', 'info');
}