function validateField(field) {
    let isValid = true;
    const fieldValue = field.value.trim();
    let errorMessage = '';

    if (field.hasAttribute('required') && !fieldValue) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    } else if (field.type === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'البريد غير صحيح';
        }
    } else if (field.name === 'password' && fieldValue.length < 6) {
        isValid = false;
        errorMessage = 'كلمة المرور قصيرة جداً';
    }

    isValid ? clearFieldError(field) : showFieldError(field, errorMessage);
    return isValid;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group') || field.parentElement;
    field.classList.add('input-error');
    let error = formGroup.querySelector('.error-text');
    if (!error) {
        error = document.createElement('span');
        error.className = 'error-text';
        error.style.color = 'red';
        error.style.fontSize = '12px';
        formGroup.appendChild(error);
    }
    error.textContent = message;
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group') || field.parentElement;
    field.classList.remove('input-error');
    const error = formGroup.querySelector('.error-text');
    if (error) error.remove();
}