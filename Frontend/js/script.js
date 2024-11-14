document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').value;

    // Validate username
    if (!username || username.length < 3) {
        alert('Username must be at least 3 characters long.');
        return;
    }

    // Validate password
    if (!password || password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Validate userType selection
    if (!userType) {
        alert('Please select a user type.');
        return;
    }

    // Send registration request to administrator
    console.log('Registration Request:', { username, password, userType });
    alert(`Registration request sent for ${username} as ${userType}. Awaiting admin approval.`);
    this.reset();
});

// Existing login validation remains unchanged
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;

    // Validate login username
    if (!loginUsername) {
        alert('Please enter your username.');
        return;
    }

    // Validate login password
    if (!loginPassword || loginPassword.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    console.log('Login Attempt:', { loginUsername, loginPassword });
    alert(`Login attempt for ${loginUsername}.`);
    this.reset();
});
