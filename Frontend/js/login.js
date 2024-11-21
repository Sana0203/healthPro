document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const userType = document.getElementById('userTypeSelectionLogin').value;
    const loginID = document.getElementById('loginID').value; // Keep as a string for flexibility
    const loginPassword = document.getElementById('loginPassword').value;

    // Debugging - log the form data
    console.log('User Type:', userType);
    console.log('Login ID:', loginID);
    console.log('Login Password:', loginPassword);

    // Validate that all required fields are filled
    if (!userType || !loginID || !loginPassword) {
        alert('Please fill in all fields.');
        return;
    }

    // Normalize the userType to ensure it is consistent with the expected capitalization (e.g., "Patient")
    const normalizedUserType = userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();

    // Debugging - log the normalized user type
    console.log('Normalized User Type:', normalizedUserType);

    // Send login request to backend using async/await for cleaner code
    loginUser(loginID, loginPassword, normalizedUserType); // Ensure loginID is parsed as an integer
});

async function loginUser(loginID, loginPassword, userType) {
    try {
        // Validate if loginID is a valid number
        if (isNaN(loginID) || loginID.trim() === '') {
            alert('Please enter a valid numeric ID.');
            return;
        }

        // Convert loginID to integer
        const parsedLoginID = parseInt(loginID);

        // Send login request to backend with the correct format
        const response = await fetch('http://localhost:5501/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserID: parsedLoginID, Password: loginPassword, UserType: userType })
        });

        if (!response.ok) {
            throw new Error('Login failed, please try again.');
        }

        const data = await response.json();
        console.log('Response Data:', data); // Log the backend response

        if (data.user) {
            const user = data.user;

            // Check if patient is approved (if user type is patient)
            if (user.userType === 'Patient' && !user.Approved) {
                alert('Your account is not approved yet. Please wait for Administrator approval.');
                return;
            }

            // Ensure the userType matches the backend response userType
            if (user.userType !== userType) {
                alert('Invalid user type.');
                return;
            }

            // Store user data in localStorage and handle redirection
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on user type
            switch (user.userType) {
            case 'Patient':
                window.location.href = './dashboard_user.html'; // Redirect to patient dashboard
                break;

            case 'Staff':
                window.location.href = './dashboard_staff.html'; // Redirect to staff dashboard
                break;

            case 'Doctor':
                window.location.href = './dashboard_doctor.html'; // Redirect to doctor dashboard
                break;

            case 'Administrator':
                window.location.href = './dashboard_admin.html'; // Redirect to admin dashboard
                break;
            default:
                alert('Invalid user type.');
            }
        } else {
            alert(data.message || 'Invalid credentials. Please try again.');
        }
    } catch (error) {
        // Log error and alert the user
        console.error('Error during fetch:', error);
        alert('Error: ' + error.message);
    }
}
