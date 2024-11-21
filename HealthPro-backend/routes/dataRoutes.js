const express = require('express');
const sql = require('mssql');
const { createPool, getData, addDoctor, addStaff, addPatient, getUnapprovedPatients, approvePatient } = require('../db'); // Import createPool function

const router = express.Router();

// Route to get users
router.get('/get_users', async (req, res) => {
    try {
        const users = await getData(); // Assuming getData() fetches the users
        console.log("Fetched users:", users); // Log the fetched users
        res.status(200).json(users); // Send a success response with status code 200
    } catch (error) {
        console.error('Error fetching users:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve users' }); // Send an error response with status code 500
    }
});

// Route to get unapproved patients
router.get('/get_unapproved', async (req, res) => {
    try {
        const users = await getUnapprovedPatients();
        console.log("Fetched users:", users); // Log the fetched users
        res.status(200).json(users); // Send a success response with status code 200
    } catch (error) {
        console.error('Error fetching users:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve users' }); // Send an error response with status code 500
    }
});

// Route to approve a patient by HealthID
router.post('/approve_patient', async (req, res) => {
    const { healthID } = req.body; // Get healthID from request body

    // Validate the input
    if (!healthID) {
        return res.status(400).json({ error: 'HealthID is required' }); // Handle missing HealthID
    }

    try {
        const result = await approvePatient(healthID); // Call the approve function

        if (!result.success) {
            return res.status(404).json({ error: result.message }); // Handle case where patient is not found or already approved
        }

        res.status(200).json({ message: result.message }); // Success response
    } catch (error) {
        console.error('Error approving patient:', error); // Log the error
        res.status(500).json({ error: 'Failed to approve patient' }); // Error response
    }
});

// Route to add a doctor
router.post('/add_doctors', async (req, res) => {
    try {
        const doctorData = req.body; // Get doctor data from request body
        await addDoctor(doctorData); // Call the function to add the doctor
        res.status(201).json({ message: 'Doctor added successfully' }); // Send success response
    } catch (error) {
        console.error('Error adding doctor:', error); // Log the error
        res.status(500).json({ error: 'Failed to add doctor' }); // Send error response
    }
});

// Route to add a staff
router.post('/add_staffs', async (req, res) => {
    try {
        const staffData = req.body; // Get staff data from request body
        await addStaff(staffData); // Call the function to add the staff
        res.status(201).json({ message: 'Staff added successfully' }); // Send success response
    } catch (error) {
        console.error('Error adding staff:', error); // Log the error
        res.status(500).json({ error: 'Failed to add staff' }); // Send error response
    }
});

// Route to add a patient (with hardcoded user data for testing)
router.get('/add_patient', async (req, res) => {
    const userData = {
        HealthID: 'P010',
        UserType: 'Patient',
        Name: 'Corina Tigran',
        Email: 'corina.tigran@gmail.com',
        PhoneNumber: '678-135-0979',
        DateOfBirth: '1995-12-14T00:00:00.000Z',
        Password: 'password',
        Approved: 0,
        Image: '' // Only send the base64 part
    };
    try {
        await addPatient(userData); // Call the function to add the patient
        res.status(201).json({ message: 'Patient added successfully' }); // Send success response
    } catch (error) {
        console.error('Error adding patient:', error); // Log the error
        res.status(500).json({ error: 'Failed to add patient' }); // Send error response
    }
});

// Route to handle user login
router.post('/login', async (req, res) => {
    const { UserID, Password, UserType } = req.body;

    // Check if both UserID, Password, and UserType are provided
    if (!UserID || !Password || !UserType) {
        return res.status(400).json({ message: 'Please provide UserID, Password, and UserType.' });
    }

    // Normalize UserType to ensure consistent formatting as per the database case
    const normalizedUserType = UserType.charAt(0).toUpperCase() + UserType.slice(1).toLowerCase();
    console.log('Normalized UserType:', normalizedUserType); // Debugging log

    try {
        // Wait for the database pool to be initialized
        const pool = await createPool();
        console.log('Database pool initialized:', pool);

        // Query the database for the user
        const result = await pool.request()
            .input('UserID', sql.Int, UserID)
            .query(`
                SELECT 
                    u.UserID, u.Name, u.Email, u.Password, u.UserType AS userType, 
                    CASE WHEN u.UserType = 'Patient' THEN p.Approved ELSE NULL END AS Approved
                FROM Users u
                LEFT JOIN Patients p ON u.UserID = p.UserID
                WHERE u.UserID = @UserID
            `);

        console.log('Database query result:', result.recordset); // Log the result

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = result.recordset[0];
        console.log('User retrieved from database:', user); // Debug log

        if (!user.Password) {
            return res.status(500).json({ message: 'Password not found for user.' });
        }

        // Compare the passwords (plain text comparison)
        console.log('Comparing passwords:', user.Password, Password);
        if (user.Password.trim() !== Password.trim()) {  // Trim whitespace for both password comparisons
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Ensure userType from the database matches the one sent by the client (case-sensitive comparison)
        console.log('Comparing user types:', user.userType, normalizedUserType);
        if (user.userType !== normalizedUserType) {
            return res.status(400).json({ message: 'Invalid user type.' });
        }

        // Check if the patient is approved (if applicable)
        if (user.userType === 'Patient' && user.Approved !== 1) {
            return res.status(403).json({ message: 'Account is not approved. Please contact the admin.' });
        }

        // Exclude the password from the response
        const { Password: _, ...userData } = user;
        res.json({ user: userData });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

module.exports = router;
