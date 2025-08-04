// Pricing structure based on number of subjects
const pricingStructure = {
    1: 200,
    2: 300,
    3: 400,
    4: 450,
    5: 550,
    6: 600,
    7: 700  // Note: Fixed the pricing for 7+ subjects to 700 (assuming the 200 was a typo)
};

// DOM elements
const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]');
const subjectCountElement = document.getElementById('subjectCount');
const totalAmountElement = document.getElementById('totalAmount');
const selectedSubjectsListElement = document.getElementById('selectedSubjectsList');
const proceedToPaymentBtn = document.getElementById('proceedToPayment');
const paymentSection = document.getElementById('paymentSection');
const registrationForm = document.getElementById('registrationForm');

// Payment summary elements
const paymentStudentName = document.getElementById('paymentStudentName');
const paymentSubjectCount = document.getElementById('paymentSubjectCount');
const paymentTotalAmount = document.getElementById('paymentTotalAmount');

// Form validation state
let formData = {};
let selectedSubjects = [];
let totalAmount = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSubjectSelection();
    initializeFormValidation();
    initializeProceedToPayment();
});

// Subject selection functionality
function initializeSubjectSelection() {
    subjectCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleSubjectSelection);
    });
}

function handleSubjectSelection(event) {
    const checkbox = event.target;
    const subjectItem = checkbox.closest('.subject-item');
    
    if (checkbox.checked) {
        subjectItem.classList.add('selected');
        selectedSubjects.push(checkbox.value);
    } else {
        subjectItem.classList.remove('selected');
        selectedSubjects = selectedSubjects.filter(subject => subject !== checkbox.value);
    }
    
    updatePricingSummary();
    validateForm();
}

function updatePricingSummary() {
    const subjectCount = selectedSubjects.length;
    
    // Update subject count
    subjectCountElement.textContent = subjectCount;
    
    // Calculate total amount
    totalAmount = subjectCount > 0 ? (pricingStructure[subjectCount] || pricingStructure[7]) : 0;
    totalAmountElement.textContent = totalAmount;
    
    // Update selected subjects list
    selectedSubjectsListElement.innerHTML = '';
    selectedSubjects.forEach(subject => {
        const li = document.createElement('li');
        li.textContent = subject;
        selectedSubjectsListElement.appendChild(li);
    });
    
    // Show/hide pricing summary based on selection
    const pricingSummary = document.querySelector('.pricing-summary');
    if (subjectCount > 0) {
        pricingSummary.style.display = 'block';
    } else {
        pricingSummary.style.display = 'none';
    }
}

// Form validation
function initializeFormValidation() {
    const requiredFields = registrationForm.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', validateField);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Basic validation
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel') {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Age validation
    if (field.name === 'age') {
        const age = parseInt(value);
        if (age < 5 || age > 25) {
            showFieldError(field, 'Age must be between 5 and 25 years');
            return false;
        }
    }
    
    // Clear error if validation passes
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function validateForm() {
    const requiredFields = registrationForm.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    // Check all required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
        }
    });
    
    // Check if at least one subject is selected
    if (selectedSubjects.length === 0) {
        isValid = false;
    }
    
    // Enable/disable proceed button
    proceedToPaymentBtn.disabled = !isValid;
    
    return isValid;
}

// Proceed to payment functionality
function initializeProceedToPayment() {
    proceedToPaymentBtn.addEventListener('click', handleProceedToPayment);
}

function handleProceedToPayment() {
    if (!validateForm()) {
        showMessage('Please fill in all required fields and select at least one subject.', 'error');
        return;
    }
    
    // Collect form data
    const formDataObj = new FormData(registrationForm);
    formData = Object.fromEntries(formDataObj.entries());
    formData.subjects = selectedSubjects;
    formData.totalAmount = totalAmount;
    
    // Update payment summary
    paymentStudentName.textContent = formData.studentName;
    paymentSubjectCount.textContent = `${selectedSubjects.length} subject${selectedSubjects.length > 1 ? 's' : ''}`;
    paymentTotalAmount.textContent = `GH₵${totalAmount}`;
    
    // Show payment section
    paymentSection.style.display = 'block';
    paymentSection.scrollIntoView({ behavior: 'smooth' });
    
    // Hide the proceed button
    proceedToPaymentBtn.style.display = 'none';
}

// Flutterwave payment integration
function initiatePayment(paymentMethod) {
    if (!formData.studentName || selectedSubjects.length === 0) {
        showMessage('Please complete the registration form first.', 'error');
        return;
    }
    
    // Generate a unique transaction reference
    const txRef = 'VCS-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    // Prepare payment configuration
    const paymentConfig = {
        public_key: "FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXX-X", // Replace with your actual public key
        tx_ref: txRef,
        amount: totalAmount,
        currency: "GHS",
        payment_options: paymentMethod === 'card' ? "card" : "mobilemoney",
        customer: {
            email: formData.email,
            phone_number: formData.phone,
            name: formData.parentName,
        },
        customizations: {
            title: "Online Vacation Class Registration",
            description: `Registration for ${formData.studentName} - ${selectedSubjects.length} subject${selectedSubjects.length > 1 ? 's' : ''}`,
            logo: "https://via.placeholder.com/100x100?text=VCS",
        },
        meta: {
            student_name: formData.studentName,
            parent_name: formData.parentName,
            subjects: selectedSubjects.join(', '),
            grade: formData.grade,
            phone: formData.phone,
        },
        callback: function(data) {
            handlePaymentCallback(data);
        },
        onclose: function() {
            showMessage('Payment was cancelled. You can try again.', 'error');
        }
    };
    
    // Configure mobile money specific options
    if (paymentMethod === 'mobilemoney') {
        paymentConfig.payment_options = "mobilemoney";
        paymentConfig.meta.payment_method = 'mobile_money';
    }
    
    try {
        FlutterwaveCheckout(paymentConfig);
    } catch (error) {
        console.error('Payment initialization error:', error);
        showMessage('Unable to initialize payment. Please try again.', 'error');
    }
}

function handlePaymentCallback(response) {
    if (response.status === "successful") {
        // Payment successful
        showMessage('Payment successful! Registration completed.', 'success');
        
        // Here you would typically send the registration data to your server
        submitRegistration(response);
        
        // Disable form to prevent resubmission
        disableForm();
        
    } else {
        // Payment failed
        showMessage('Payment failed. Please try again.', 'error');
    }
}

function submitRegistration(paymentResponse) {
    // Prepare registration data
    const registrationData = {
        ...formData,
        paymentReference: paymentResponse.tx_ref,
        paymentId: paymentResponse.transaction_id,
        paymentStatus: paymentResponse.status,
        registrationDate: new Date().toISOString(),
        subjects: selectedSubjects,
        totalAmount: totalAmount
    };
    
    // In a real application, you would send this data to your server
    console.log('Registration Data:', registrationData);
    
    // For demo purposes, show success message with registration details
    showRegistrationSuccess(registrationData);
}

function showRegistrationSuccess(data) {
    const successHtml = `
        <div class="registration-success">
            <h2>🎉 Registration Successful!</h2>
            <div class="success-details">
                <p><strong>Student:</strong> ${data.studentName}</p>
                <p><strong>Grade:</strong> ${data.grade}</p>
                <p><strong>Subjects:</strong> ${data.subjects.join(', ')}</p>
                <p><strong>Total Amount:</strong> GH₵${data.totalAmount}</p>
                <p><strong>Payment Reference:</strong> ${data.paymentReference}</p>
                <p><strong>Registration Date:</strong> ${new Date(data.registrationDate).toLocaleDateString()}</p>
            </div>
            <p class="success-note">
                A confirmation email will be sent to <strong>${data.email}</strong> with class schedules and further instructions.
            </p>
        </div>
    `;
    
    // Replace form content with success message
    document.querySelector('.registration-form').innerHTML = successHtml;
}

function disableForm() {
    const formElements = registrationForm.querySelectorAll('input, select, textarea, button');
    formElements.forEach(element => {
        element.disabled = true;
    });
}

// Utility function to show messages
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the form
    const form = document.querySelector('.registration-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove after 5 seconds for non-error messages
    if (type !== 'error') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// Add CSS for error styling and success message
const additionalStyles = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e53e3e;
        background-color: #fed7d7;
    }
    
    .registration-success {
        text-align: center;
        padding: 40px;
        color: #155724;
    }
    
    .registration-success h2 {
        font-size: 2rem;
        margin-bottom: 30px;
        color: #28a745;
    }
    
    .success-details {
        background: #d4edda;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: left;
    }
    
    .success-details p {
        margin: 10px 0;
        font-size: 1.1rem;
    }
    
    .success-note {
        background: #fff3cd;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
        color: #856404;
        font-style: italic;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize pricing summary on page load
updatePricingSummary();