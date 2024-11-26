const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }
    checkAuthStatus();
});

async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const user = await response.json();
            // User is authenticated, redirect to index.html if on login page
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
        } else {
            // User is not authenticated, redirect to login.html if not already there
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

async function login(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function register(e) {
    e.preventDefault();
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful. Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
}
async function logout() {
    try {
        const response = await fetch(`${API_URL}/users/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = 'login.html';
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout. Please try again.');
    }
}

// Expose logout function globally
window.logout = logout;
