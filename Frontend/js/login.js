document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const userType = document.getElementById('userTypeSelectionLogin').value;
    const loginID = document.getElementById('loginID').value; // Keep it as a string for more flexibility
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
    loginUser(loginID, loginPassword, normalizedUserType);
});

async function loginUser(loginID, loginPassword, userType) {
    try {
        const response = await fetch('http://localhost:5501/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserID: loginID, Password: loginPassword, UserType: userType })
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
                alert('Your account is not approved yet. Please wait for admin approval.');
                return;
            }

            // Store user data in localStorage and handle redirection
            localStorage.setItem('user', JSON.stringify(user));

            // Ensure userType matches the response
            if (user.userType !== userType) {
                alert('Invalid user type.');
                return;
            }

            // Redirect based on user type
            switch (user.userType) {
                case 'Patient':
                    window.location.href = 'dashboard_patient.html'; // Redirect to patient dashboard
                    break;

                case 'Staff':
                    window.location.href = 'dashboard_staff.html'; // Redirect to staff dashboard
                    break;

                case 'Doctor':
                    window.location.href = 'dashboard_doctor.html'; // Redirect to doctor dashboard
                    break;

                case 'Admin':
                    window.location.href = 'dashboard_admin.html'; // Redirect to admin dashboard
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
