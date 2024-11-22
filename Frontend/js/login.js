// Add an event listener to the login form
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const userType = document.getElementById('userTypeSelectionLogin').value.trim();
    const loginID = document.getElementById('loginID').value.trim(); // This will be either HealthID or WorkID
    const loginPassword = document.getElementById('loginPassword').value.trim();

    // Debugging - log the form data
    console.log('User Type:', userType);
    console.log('Login ID:', loginID); // This will be HealthID or WorkID
    console.log('Login Password:', loginPassword);

    // Validate that all required fields are filled
    if (!userType || !loginID || !loginPassword) {
        alert('Please fill in all fields.');
        return;
    }

    // Validate user type
    const allowedUserTypes = ['Patient', 'Administrator', 'Doctor', 'Staff'];
    const normalizedUserType = userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();
    if (!allowedUserTypes.includes(normalizedUserType)) {
        alert('Invalid user type selected. Please choose a valid option.');
        return;
    }

    // Debugging - log the normalized user type
    console.log('Normalized UserType:', normalizedUserType);

    // Show/Hide "Did not register yet? Register here" link based on user type
    const registerLink = document.getElementById('registerLink');
    const registerSection = document.getElementById('registerSection');
    
    if (normalizedUserType === 'Patient') {
        registerLink.style.display = 'block';   // Show the "Register here" link
        registerSection.style.display = 'none'; // Hide the registration form initially
    } else {
        registerLink.style.display = 'none';  // Hide the "Register here" link
        registerSection.style.display = 'none'; // Ensure the registration form is hidden
    }

    // Send login request to backend
    loginUser(loginID, loginPassword, normalizedUserType);
});

// Function to handle login
async function loginUser(loginID, loginPassword, userType) {
    try {
        // Prepare the body of the request based on user type
        const body = {
            Password: loginPassword,
            UserType: userType
        };

        if (userType === 'Patient') {
            body.HealthID = loginID;
        } else {
            body.WorkID = loginID;
        }

        // Send login request to backend
        const response = await fetch('http://localhost:5501/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        // Check if the response is successful
        if (!response.ok) {
            const errorMessage = `Error: ${response.status} - ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Response Data:', data);

        if (data.user) {
            const user = data.user;

            // Check if patient is approved (if user type is patient)
            if (user.userType === 'Patient' && !user.Approved) {
                alert('Your account is not approved yet. Please wait for Administrator approval.');
                return;
            }

            // Ensure the userType matches the backend response userType
            if (user.userType !== userType) {
                alert('User type mismatch. Please try again.');
                return;
            }

            // Store user data in localStorage and handle redirection
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on user type
            const redirectionUrls = {
                Patient: './dashboard_user.html',
                Staff: './dashboard_staff.html',
                Doctor: './dashboard_doctor.html',
                Administrator: './dashboard_admin.html'
            };

            const redirectUrl = redirectionUrls[user.userType];
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                alert('Redirection URL not configured for this user type.');
            }
        } else {
            alert(data.message || 'Invalid credentials. Please try again.');
        }
    } catch (error) {
        // Log error and alert the user
        console.error('Error during fetch:', error);
        alert('An error occurred: ' + error.message);
    }
}
