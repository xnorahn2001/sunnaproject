// ==================== GLOBAL VALIDATION SETUP ==================== 
document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidation();
    setupFormSubmissionHandlers(); // تفعيل التحقق عند الإرسال
});

function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input:not([type="submit"]), textarea');
        
        inputs.forEach(input => {
            // التحقق في الوقت الفعلي عند مغادرة الحقل
            input.addEventListener('blur', function() {
                validateField(this);
            });

            // التحقق المستمر أثناء الكتابة إذا كان الحقل في حالة خطأ بالفعل
            input.addEventListener('input', function() {
                // نتحقق فقط إذا كان الحقل يعرض خطأ بالفعل لتجنب التشتيت
                if (this.classList.contains('input-error')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateField(field) {
    let isValid = true;
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const fieldType = field.type;
    let errorMessage = '';

    // --- Required check ---
    if (field.hasAttribute('required') && !fieldValue) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    }

    // --- Email validation ---
    else if (fieldType === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'البريد الإلكتروني غير صحيح';
        }
    }

    // --- Password validation ---
    else if (fieldName === 'password' && fieldValue) {
        if (fieldValue.length < 6) {
            isValid = false;
            errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        }
    }

    // --- Confirm password validation ---
    else if (fieldName === 'confirmPassword' && fieldValue) {
        const passwordField = document.querySelector('input[name="password"]');
        if (passwordField && passwordField.value !== fieldValue) {
            isValid = false;
            errorMessage = 'كلمة المرور غير متطابقة';
        }
    }

    // --- Name validation ---
    else if ((fieldName === 'name' || fieldName === 'fullname') && fieldValue) {
        if (fieldValue.length < 3) {
            isValid = false;
            errorMessage = 'الاسم يجب أن يكون 3 أحرف على الأقل';
        }
    }
    
    // --- Message validation (for textarea) ---
    else if (field.tagName === 'TEXTAREA' && field.hasAttribute('required') && fieldValue.length < 10) {
        isValid = false;
        errorMessage = 'الرسالة يجب أن تحتوي على 10 أحرف على الأقل';
    }

    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    // 💡 نستخدم .form-field-wrapper إذا كان موجوداً، وإلا نستخدم أقرب .form-group
    const formGroup = field.closest('.form-group-modern') || field.closest('.form-group');
    if (!formGroup) return;

    // إضافة كلاس الخطأ إلى حقل الإدخال نفسه لـ CSS Styling
    field.classList.add('input-error');

    // إزالة رسالة الخطأ القديمة
    const oldError = formGroup.querySelector('.form-error-message');
    if (oldError) oldError.remove();

    // إنشاء وإضافة رسالة الخطأ
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error-message mt-1 text-sm text-red-600'; // كلاسات Tailwind
    errorElement.textContent = message;
    
    // نضع رسالة الخطأ بعد الحقل مباشرة
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group-modern') || field.closest('.form-group');
    if (!formGroup) return;

    field.classList.remove('input-error');
    
    const errorElement = formGroup.querySelector('.form-error-message');
    if (errorElement) errorElement.remove();
}

// ==================== FORM SUBMISSION VALIDATION ==================== 
function validateForm(form) {
    let isFormValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], input[type="email"], input[name="password"], input[name="confirmPassword"]');
    
    inputs.forEach(input => {
        // إذا فشل التحقق في أي حقل، سيتم إظهار رسالة الخطأ
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

function setupFormSubmissionHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showFormError('يرجى تصحيح الأخطاء في النموذج لإرساله.');
                // التركيز على أول حقل خطأ لمساعدة المستخدم
                this.querySelector('.input-error')?.focus();
            } else {
                // إذا كان التحقق ناجحاً، يمكنك تفعيل رسالة نجاح هنا
                // showFormSuccess('تم التحقق بنجاح! جاري الإرسال...');
                // إذا كان لديك معالج (Handler) خارجي (مثل handleContact)، يجب أن يتم استدعاؤه هنا
            }
        });
    });
}

// ==================== UTILITY VALIDATION FUNCTIONS (التي كانت موجودة) ==================== 
// (تم دمج isValidEmail في validateField)

// ==================== ERROR & SUCCESS NOTIFICATIONS ==================== 
// (تم الإبقاء على نظام الإشعارات كما هو، يمكنك تطبيق تنسيقات CSS له)

function showFormError(message) {
    const notification = createNotification(message, 'error');
    document.body.appendChild(notification);
    autoRemoveNotification(notification);
}

function showFormSuccess(message) {
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);
    autoRemoveNotification(notification);
}

function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // تنسيقات CSS للإشعارات
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s, transform 0.3s;
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

    return notification;
}

function autoRemoveNotification(notification) {
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


// ==================== USER TYPE SELECTOR (كما كانت) ==================== 
document.addEventListener('DOMContentLoaded', function() {
    const userTypeRadios = document.querySelectorAll('input[name="userType"]');
    const additionalFields = document.getElementById('additionalFields');

    if (userTypeRadios.length > 0) {
        userTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (additionalFields) {
                    additionalFields.style.display = this.checked ? 'block' : 'none';
                }
            });
        });
    }
});