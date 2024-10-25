document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    // Send registration request to administrator
    // For demonstration purposes, we'll just log it
    console.log('Registration Request:', { username, password, userType });

    // Here you can add an AJAX request to your backend to send this data
    alert(`Registration request sent for ${username} as ${userType}. Awaiting admin approval.`);
    this.reset();
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;

    // For demonstration purposes, we'll just log it
    console.log('Login Attempt:', { loginUsername, loginPassword });

    // Here you can add an AJAX request to your backend to handle the login
    alert(`Login attempt for ${loginUsername}.`);
    this.reset();
});
