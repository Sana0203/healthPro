// Event listener to handle login form submission
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

    // Send login request to backend
    loginUser(loginID, loginPassword, normalizedUserType);
});

// Event listener to dynamically show/hide the "Register here" link based on user type selection
document.getElementById('userTypeSelectionLogin').addEventListener('change', function () {
    const userType = this.value.trim();
    const normalizedUserType = userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();

    const registerLink = document.getElementById('registerLink');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');

    // Show/Hide the registration link and form based on user type
    if (normalizedUserType === 'Patient') {
        registerLink.style.display = 'block';   // Show the "Register here" link
        registerSection.style.display = 'none'; // Ensure the registration form is hidden

        document.getElementById('ShowRegisterSection').addEventListener('click', function () {
            loginSection.style.display = 'none';      // Hide the login section
            registerSection.style.display = 'block';  // Show the registration section
        });

    } else {
        registerLink.style.display = 'none';    // Hide the "Register here" link
        registerSection.style.display = 'none'; // Ensure the registration form is hidden
    }
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

// Handle registration form submission
// Ensure this script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Attach the submit event listener to the register form
    document.getElementById('registerForm').addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent form from refreshing the page

        // Collect form data
        const userData = {
            HealthID: document.getElementById('registerHealthID').value,
            Name: document.getElementById('registerName').value,
            Email: document.getElementById('registerEmail').value,
            PhoneNumber: document.getElementById('registerPhone').value,
            Gender: document.getElementById('registerGender').value,
            DateOfBirth: document.getElementById('registerDateOfBirth').value,
            Password: document.getElementById('registerPassword').value,
            Image: document.getElementById('registerImage').files[0]?.name || "", // Optional image field, default to empty string if not provided
            Removed: 0, // Default value for Removed field is 0
            Approved: false, // Assuming registration defaults to not approved
        };

        // Check if passwords match
        const confirmPassword = document.getElementById('confirmRegisterPassword').value;
        if (userData.Password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Call the addPatient function to save data
        try {
            await addPatient(userData);
            alert('Registration successful!');
            // Redirect or reset the form
            document.getElementById('registerForm').reset();
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed. Please try again.');
        }
    });
});

// Assuming you have this addPatient function defined somewhere
async function addPatient(userData) {
    try {
        // Call API or send data to the server here
        console.log('Patient data:', userData);  // For debugging
        // You can add your AJAX call or fetch API logic here to save data
    } catch (error) {
        throw new Error('Failed to add patient');
    }
}
