const express = require('express');
const sql = require('mssql');
const { createPool } = require('../db'); // Import createPool function

const router = express.Router();

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
        if (user.Password !== Password) {
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
