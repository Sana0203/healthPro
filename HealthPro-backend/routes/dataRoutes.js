const express = require('express');
const sql = require('mssql');
const { createPool, getData, addDoctor, addStaff, addPatient, getUnapprovedPatients, approvePatient, getAllPatients, getAllStaff, getAllDoctors, deleteUser, updateProfile, changeUserPassword } = require('../db'); // Import createPool function
const {
    createPool,
    getData,
    addDoctor,
    addStaff,
    addPatient,
    getUnapprovedPatients,
    approvePatient,
} = require('../db');

const router = express.Router();

// Route to get all users
router.get('/get_users', async (req, res) => {
    try {
        const users = await getData();
        console.log('Fetched users:', users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

router.get('/get_users', async (req, res) => { // Include req as a parameter
    try {
        const users = await getData(); // Assuming getData() fetches the users
        console.log("Fetched users:", users); // Log the fetched users
        res.status(200).json(users); // Send a success response with status code 200
    } catch (error) {
        console.error('Error fetching users:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve users' }); // Send an error response with status code 500
    }
});

router.get('/get_patients', async (req, res) => {
    try {
        const patients = await getAllPatients(); // Fetch all patients
        console.log("Fetched patients:", patients); // Log the fetched patients
        res.status(200).json(patients); // Send a success response with status code 200
    } catch (error) {
        console.error('Error fetching patients:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve patients' }); // Send an error response with status code 500
    }
});

router.get('/get_staff', async (req, res) => {
    try {
        const staff = await getAllStaff(); // Fetch all staff
        console.log("Fetched staff:", staff); // Log the fetched staff
        res.status(200).json(staff); // Send a success response with status code 200
    } catch (error) {
        console.error('Error fetching staff:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve staff' }); // Send an error response with status code 500
    }
});

router.get('/get_doctors', async (req, res) => {
    try {
        const doctors = await getAllDoctors(); // Fetch all doctors
        console.log("Fetched doctors:", doctors); // Log the fetched doctors
        res.status(200).json(doctors); // Send a success response with status code 200
    } catch (error) {
        console.error('Error fetching doctors:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve doctors' }); // Send an error response with status code 500
    }
});

router.get('/get_unapproved', async (req, res) => { // Include req as a parameter
    try {
        const unapprovedPatients = await getUnapprovedPatients();
        console.log('Fetched unapproved patients:', unapprovedPatients);
        res.status(200).json(unapprovedPatients);
    } catch (error) {
        console.error('Error fetching unapproved patients:', error);
        res.status(500).json({ error: 'Failed to retrieve unapproved patients' });
    }
});

// Route to approve a patient by HealthID
router.post('/approve_patient', async (req, res) => {
    const { HealthID } = req.body;

    if (!HealthID) {
        return res.status(400).json({ error: 'HealthID is required' });
    }

    try {
        const result = await approvePatient(HealthID);
        if (!result.success) {
            return res.status(404).json({ error: result.message });
        }

        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error approving patient:', error);
        res.status(500).json({ error: 'Failed to approve patient' });
    }
});

router.delete('/delete_user', async(req, res) => {
    const { id, userType } = req.body; 
    console.log('Request body:', req.body); // Log the request body for debugging

    // Validate input
    if (!id || !userType) {
        return res.status(400).json({ error: 'userID and userType are required' });
    }

    try {
        await deleteUser(id, userType);
        console.log('Delete user result:'); // Log the result for debugging
        res.status(201).json({ message: 'Account removed successfully' });
    } catch (error) {
        console.error('Error in delete_user route:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

router.post('/login', async (req, res) => {
    const { HealthID, WorkID, Password, UserType } = req.body;

    if (
        (UserType === 'Patient' && !HealthID) ||
        (['Administrator', 'Doctor', 'Staff'].includes(UserType) && !WorkID) ||
        !Password ||
        !UserType
    ) {
        return res.status(400).json({ message: 'Please provide HealthID or WorkID, Password, and UserType.' });
    }

    const normalizedUserType = UserType.charAt(0).toUpperCase() + UserType.slice(1).toLowerCase();
    console.log('Normalized UserType:', normalizedUserType);

    try {
        const pool = await createPool();
        console.log('Database pool initialized.');

        let query;
        if (normalizedUserType === 'Patient') {
            query = `
                SELECT 
                u.UserID, 
                u.Name, 
                u.Email, 
                u.Password, 
                u.UserType AS userType, 
                p.HealthID,
                COALESCE(p.Approved, 0) AS Approved -- Default to false if null
            FROM Users u
            LEFT JOIN Patients p ON u.UserID = p.UserID
            WHERE p.HealthID = @ID;

            `;
        } else {
            query = `
                SELECT 
                u.UserID, 
                u.Name, 
                u.Email, 
                u.Password, 
                u.UserType AS userType, 
                CASE 
                    WHEN u.UserType = 'Administrator' THEN a.WorkID
                    WHEN u.UserType = 'Doctor' THEN d.WorkID
                    WHEN u.UserType = 'Staff' THEN s.WorkID
                    ELSE NULL
                END AS WorkID
            FROM Users u
            LEFT JOIN Administrators a ON u.UserID = a.UserID AND u.UserType = 'Administrator'
            LEFT JOIN Doctors d ON u.UserID = d.UserID AND u.UserType = 'Doctor'
            LEFT JOIN Staff s ON u.UserID = s.UserID AND u.UserType = 'Staff'
            WHERE 
                (u.UserType = 'Administrator' AND a.WorkID = @ID) OR
                (u.UserType = 'Doctor' AND d.WorkID = @ID) OR
                (u.UserType = 'Staff' AND s.WorkID = @ID);

            `;}

        const result = await pool.request()
            .input('ID', sql.NVarChar, normalizedUserType === 'Patient' ? HealthID : WorkID)
            .query(query);

        console.log('Database query result:', result.recordset);

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = result.recordset[0];
        console.log('User retrieved from database:', user);

        if (user.Password.trim() !== Password.trim()) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        if (user.userType !== normalizedUserType) {
            return res.status(400).json({ message: 'Invalid user type.' });
        }

        if (user.userType === 'Patient' && user.Approved !== 1) {
            return res.status(403).json({ message: 'Account is not approved. Please contact the admin.' });
        }

        const { Password: _, ...userData } = user; // Exclude password from the response
        res.status(200).json({ user: userData });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

router.post('/profile', async (req, res) => {
    const userData = req.body; // Get user data from request body

    // Validate the input
    const { UserID, Name, Email, PhoneNumber, DateOfBirth, Gender } = userData;
    if (!UserID || !Name || !Email || !PhoneNumber || !DateOfBirth || !Gender) {
        return res.status(400).json({ error: 'User ID, Name, Email, PhoneNumber, DateOfBirth, and Gender are required' }); // Handle missing fields
    }

    try {
        const result = await updateProfile(userData); // Call the update function

        if (!result.success) {
            return res.status(404).json({ error: result.message }); // Handle case where user is not found or no changes made
        }

        res.status(200).json({ message: result.message }); // Success response
    } catch (error) {
        console.error('Error updating user:', error); // Log the error
        res.status(500).json({ error: 'Failed to update user' }); // Error response
    }
});

router.post('/change_password', async (req, res) => {
    const { UserID, NewPassword } = req.body; // Get UserID and NewPassword from request body

    // Validate the input
    if (!UserID || !NewPassword) {
        return res.status(400).json({ error: 'User ID and NewPassword are required' }); // Handle missing fields
    }

    try {

        const result = await changeUserPassword(UserID, NewPassword); // Call the update function

        if (!result.success) {
            return res.status(404).json({ error: result.message }); // Handle case where user is not found
        }

        res.status(200).json({ message: result.message }); // Success response
    } catch (error) {
        console.error('Error changing password:', error); // Log the error
        res.status(500).json({ error: 'Failed to change password' }); // Error response
    }
});

module.exports = router;



