// Authentication Module
let currentUser = null;
let authToken = localStorage.getItem('authToken') || null;
const API_URL = '/api/auth';

// DOM Elements
let signInBtn;
let signUpBtn;
let logoutBtn;
let userNameDisplay;
let authButtons;
let userInfo;
let signInModal;
let signUpModal;
let closeSignIn;
let closeSignUp;
let signInForm;
let signUpForm;
let signInError;
let signUpError;
let changePasswordBtn;
let changePasswordModal;
let closeChangePassword;
let changePasswordForm;
let changePasswordError;
let changePasswordSuccess;

// Initialize auth functionality
function initializeAuth() {
    // Get DOM elements
    signInBtn = document.getElementById('signInBtn');
    signUpBtn = document.getElementById('signUpBtn');
    logoutBtn = document.getElementById('logoutBtn');
    userNameDisplay = document.getElementById('userNameDisplay');
    authButtons = document.getElementById('authButtons');
    userInfo = document.getElementById('userInfo');
    signInModal = document.getElementById('signInModal');
    signUpModal = document.getElementById('signUpModal');
    closeSignIn = document.getElementById('closeSignIn');
    closeSignUp = document.getElementById('closeSignUp');
    signInForm = document.getElementById('signInForm');
    signUpForm = document.getElementById('signUpForm');
    signInError = document.getElementById('signInError');
    signUpError = document.getElementById('signUpError');
    changePasswordBtn = document.getElementById('changePasswordBtn');
    changePasswordModal = document.getElementById('changePasswordModal');
    closeChangePassword = document.getElementById('closeChangePassword');
    changePasswordForm = document.getElementById('changePasswordForm');
    changePasswordError = document.getElementById('changePasswordError');
    changePasswordSuccess = document.getElementById('changePasswordSuccess');

    // Set up event listeners
    signInBtn.addEventListener('click', openSignInModal);
    signUpBtn.addEventListener('click', openSignUpModal);
    logoutBtn.addEventListener('click', logout);
    closeSignIn.addEventListener('click', closeSignInModal);
    closeSignUp.addEventListener('click', closeSignUpModal);
    signInForm.addEventListener('submit', handleSignIn);
    signUpForm.addEventListener('submit', handleSignUp);
    changePasswordBtn.addEventListener('click', openChangePasswordModal);
    closeChangePassword.addEventListener('click', closeChangePasswordModal);
    changePasswordForm.addEventListener('submit', handleChangePassword);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === signInModal) closeSignInModal();
        if (e.target === signUpModal) closeSignUpModal();
        if (e.target === changePasswordModal) closeChangePasswordModal();
    });

    // Check if user is already logged in
    if (authToken) {
        fetchUserProfile();
    } else {
        updateAuthUI();
    }
}
// Change Password Modal functions
function openChangePasswordModal() {
    changePasswordModal.style.display = 'block';
    changePasswordForm.reset();
    changePasswordError.textContent = '';
    changePasswordSuccess.textContent = '';
}

function closeChangePasswordModal() {
    changePasswordModal.style.display = 'none';
    changePasswordForm.reset();
    changePasswordError.textContent = '';
    changePasswordSuccess.textContent = '';
}

// Handle change password form submission
async function handleChangePassword(e) {
    e.preventDefault();
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        changePasswordError.textContent = 'New passwords do not match.';
        changePasswordSuccess.textContent = '';
        return;
    }

    try {
        const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });
        const data = await response.json();
        if (!response.ok) {
            changePasswordError.textContent = data.message || 'Failed to change password.';
            changePasswordSuccess.textContent = '';
        } else {
            changePasswordError.textContent = '';
            changePasswordSuccess.textContent = 'Password updated successfully!';
            changePasswordForm.reset();
            setTimeout(() => {
                changePasswordModal.style.display = 'none';
            }, 1500);
        }
    } catch (error) {
        changePasswordError.textContent = 'Error: ' + (error.message || 'Unknown error.');
        changePasswordSuccess.textContent = '';
    }
}

// Fetch user profile if token exists
async function fetchUserProfile() {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateAuthUI();
        } else {
            // Token is invalid or expired
            logout();
        }
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        logout();
    }
}

// Update UI based on authentication state
function updateAuthUI() {
    if (currentUser) {
        // User is logged in
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        userNameDisplay.textContent = currentUser.name;
    } else {
        // User is logged out
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

// Modal functions
function openSignInModal() {
    signInModal.style.display = 'block';
    document.getElementById('signInEmail').focus();
}

function closeSignInModal() {
    signInModal.style.display = 'none';
    signInForm.reset();
    signInError.style.display = 'none';
}

function openSignUpModal() {
    signUpModal.style.display = 'block';
    document.getElementById('signUpName').focus();
}

function closeSignUpModal() {
    signUpModal.style.display = 'none';
    signUpForm.reset();
    signUpError.style.display = 'none';
}

// Handle sign in form submission
async function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            signInError.textContent = data.message || 'Login failed';
            signInError.style.display = 'block';
            return;
        }
        
        // Login successful
        authToken = data.token;
        currentUser = data.user;
        
        // Save token to localStorage
        localStorage.setItem('authToken', authToken);
        
        updateAuthUI();
        closeSignInModal();
    } catch (error) {
        console.error('Login error:', error);
        if (error.message && error.message.includes('Failed to fetch')) {
            signInError.textContent = 'Unable to connect to the server. Please make sure the server is running.';
        } else {
            signInError.textContent = `Error: ${error.message || 'An unknown error occurred'}. Please try again.`;
        }
        signInError.style.display = 'block';
    }
}

// Handle sign up form submission
async function handleSignUp(e) {
    e.preventDefault();
    
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;
    
    // Check if passwords match
    if (password !== confirmPassword) {
        signUpError.textContent = 'Passwords do not match';
        signUpError.style.display = 'block';
        return;
    }
    
    try {
        console.log('Sending registration request...');
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        console.log('Registration response received:', response);
        const data = await response.json();
        console.log('Registration response data:', data);
        
        if (!response.ok) {
            signUpError.textContent = data.message || 'Registration failed';
            signUpError.style.display = 'block';
            return;
        }
        
        // Registration successful
        authToken = data.token;
        currentUser = data.user;
        
        // Save token to localStorage
        localStorage.setItem('authToken', authToken);
        
        updateAuthUI();
        closeSignUpModal();
        
        // Show welcome message
        alert(`Welcome, ${name}! Your account has been created successfully.`);
    } catch (error) {
        console.error('Registration error:', error);
        if (error.message && error.message.includes('Failed to fetch')) {
            signUpError.textContent = 'Unable to connect to the server. Please make sure the server is running.';
        } else {
            signUpError.textContent = `Error: ${error.message || 'An unknown error occurred'}. Please try again.`;
        }
        signUpError.style.display = 'block';
    }
}

// Logout function
function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('authToken');
    updateAuthUI();
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null && authToken !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Get auth token for API requests
function getAuthToken() {
    return authToken;
}

// Add authorization headers to fetch requests
function authFetch(url, options = {}) {
    if (!authToken) {
        return fetch(url, options);
    }
    
    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${authToken}`
        }
    };
    
    return fetch(url, authOptions);
}

export {
    initializeAuth,
    isAuthenticated,
    getCurrentUser,
    getAuthToken,
    authFetch
};
