const sql = require('mssql');

// Configuration for the SQL Server connection
const config = {
    user: 'AmritjotSingh', // Replace with your database username
    password: 'ammy@Ammy', // Replace with your database password
    server: 'healthpro1.database.windows.net', // Replace with your SQL Server address
    database: 'healthpro', // Replace with your database name
    options: {
        encrypt: true, // Use true if you're connecting to Azure SQL
        trustServerCertificate: true // Change as needed
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000 // Time (ms) before unused connections are closed
    }
};

// A single pool instance to be reused
let poolPromise = null;

// Function to create and return the connection pool (singleton pattern)
async function createPool() {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config).connect()
            .then(pool => {
                console.log('Connected to SQL Server');
                return pool;
            })
            .catch(err => {
                console.error('Database connection failed:', err);
                throw new Error('Database initialization error');
            });
    }
    return poolPromise;
}

// Optional: Test the connection (for debugging)
async function testConnection(pool) {
    try {
        const result = await pool.request().query('SELECT 1 AS test');
        console.log('Test query successful:', result.recordset);
    } catch (err) {
        console.error('Test query failed:', err);
    }
}

async function getAllUsers() {
    try {
        const pool = await createPool();
        await testConnection(pool); 
        console.log("yes");
        // Query to select all users
        const result = await sql.query`SELECT TOP (1000) [UserID]
      ,[UserType]
      ,[Name]
      ,[Email]
      ,[PhoneNumber]
      ,[DateOfBirth]
      ,[Password]
        FROM [dbo].[Users]`; 
        
        // Return the list of users
        return result.recordset;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error; // Rethrow the error for handling in the calling function
    } finally {
        // Close the connection
        await sql.close();
    }
}

// Example function to query data
async function getData() {
    const pool = await createPool();

    // Example of querying data
    try {
        const result = await pool.request().query('SELECT * FROM Users');
        console.log('Test query successful:', result.recordset);
        return result.recordset; // Return the fetched data
    } catch (err) {
        console.error('Query failed:', err);
        throw err; // Optionally throw the error to be handled by the calling function
    }
}

// Function to add a doctor
async function addDoctor(userData) {
    const pool = await createPool();
    try {
        // Create a new connection pool
        const pool = await sql.connect(config);
        
        // Start a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Insert user into Users table
            const userInsert = await transaction.request()
                .input('UserType', sql.NVarChar, "Doctor")
                .input('Name', sql.NVarChar, userData.Name)
                .input('Email', sql.NVarChar, userData.Email)
                .input('PhoneNumber', sql.NVarChar, userData.PhoneNumber)
                .input('DateOfBirth', sql.Date, userData.DateOfBirth)
                .input('Password', sql.NVarChar, userData.Password)
                .input('Image', sql.NVarChar, userData.Image)
                .query('INSERT INTO Users (UserType, Name, Email, PhoneNumber, DateOfBirth, Password, Image) OUTPUT INSERTED.UserID VALUES (@UserType, @Name, @Email, @PhoneNumber, @DateOfBirth, @Password, @Image)');

            const userId = userInsert.recordset[0].UserID; // Get the inserted UserID

            // Insert doctor into Doctors table
            await transaction.request()
                .input('WorkID', sql.NVarChar, userData.WorkID)
                .input('UserID', sql.Int, userId) // Use the UserID from the previous insert
                .query('INSERT INTO Doctors (WorkID, UserID) VALUES (@WorkID, @UserID)');

            // Commit the transaction
            await transaction.commit();
            console.log('User  and Doctor added successfully');
        } catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            console.error('Error adding user and doctor:', error);
            throw new Error('Failed to add user and doctor');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    } 
}

// Function to add a doctor
async function addStaff(userData) {
    const pool = await createPool();
    try {
        // Create a new connection pool
        const pool = await sql.connect(config);
        
        // Start a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Insert user into Users table
            const userInsert = await transaction.request()
                .input('UserType', sql.NVarChar, "Staff")
                .input('Name', sql.NVarChar, userData.Name)
                .input('Email', sql.NVarChar, userData.Email)
                .input('PhoneNumber', sql.NVarChar, userData.PhoneNumber)
                .input('DateOfBirth', sql.Date, userData.DateOfBirth)
                .input('Password', sql.NVarChar, userData.Password)
                .input('Image', sql.NVarChar, userData.Image)
                .query('INSERT INTO Users (UserType, Name, Email, PhoneNumber, DateOfBirth, Password, Image) OUTPUT INSERTED.UserID VALUES (@UserType, @Name, @Email, @PhoneNumber, @DateOfBirth, @Password, @Image)');

            const userId = userInsert.recordset[0].UserID; // Get the inserted UserID

            // Insert doctor into Staffs table
            await transaction.request()
                .input('WorkID', sql.NVarChar, userData.WorkID)
                .input('UserID', sql.Int, userId) // Use the UserID from the previous insert
                .query('INSERT INTO Staff (WorkID, UserID) VALUES (@WorkID, @UserID)');

            // Commit the transaction
            await transaction.commit();
            console.log('User and Staff added successfully');
        } catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            console.error('Error adding user and staff:', error);
            throw new Error('Failed to add user and staff');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    } 
}

// Function to add a Administrator
async function addAdmin(userData) {
    const pool = await createPool();
    try {
        // Create a new connection pool
        const pool = await sql.connect(config);
        
        // Start a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Insert user into Users table
            const userInsert = await transaction.request()
                .input('UserType', sql.NVarChar, "Administrator")
                .input('Name', sql.NVarChar, userData.Name)
                .input('Email', sql.NVarChar, userData.Email)
                .input('PhoneNumber', sql.NVarChar, userData.PhoneNumber)
                .input('DateOfBirth', sql.Date, userData.DateOfBirth)
                .input('Password', sql.NVarChar, userData.Password)
                .input('Image', sql.NVarChar, userData.Image)
                .query('INSERT INTO Users (UserType, Name, Email, PhoneNumber, DateOfBirth, Password, Image) OUTPUT INSERTED.UserID VALUES (@UserType, @Name, @Email, @PhoneNumber, @DateOfBirth, @Password, @Image)');

            const userId = userInsert.recordset[0].UserID; // Get the inserted UserID

            // Insert doctor into Staffs table
            await transaction.request()
                .input('WorkID', sql.NVarChar, userData.WorkID)
                .input('UserID', sql.Int, userId) // Use the UserID from the previous insert
                .query('INSERT INTO Administrators (WorkID, UserID) VALUES (@WorkID, @UserID)');

            // Commit the transaction
            await transaction.commit();
            console.log('User and Administrator added successfully');
        } catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            console.error('Error adding user and administrator:', error);
            throw new Error('Failed to add user and administrator');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    } 
}

// Function to add a patient
async function addPatient(userData) {
    const pool = await createPool();
    try {
        // Create a new connection pool
        const pool = await sql.connect(config);
        
        // Start a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Insert user into Users table
            const userInsert = await transaction.request()
                .input('UserType', sql.NVarChar, "Patient")
                .input('Name', sql.NVarChar, userData.Name)
                .input('Email', sql.NVarChar, userData.Email)
                .input('PhoneNumber', sql.NVarChar, userData.PhoneNumber)
                .input('DateOfBirth', sql.Date, userData.DateOfBirth)
                .input('Password', sql.NVarChar, userData.Password)
                .input('Image', sql.NVarChar, userData.Image || "")//image is optional
                .query('INSERT INTO Users (UserType, Name, Email, PhoneNumber, DateOfBirth, Password, Image) OUTPUT INSERTED.UserID VALUES (@UserType, @Name, @Email, @PhoneNumber, @DateOfBirth, @Password, @Image)');

            const userId = userInsert.recordset[0].UserID; // Get the inserted UserID

            // Insert doctor into Patients table
            await transaction.request()
                .input('HealthID', sql.NVarChar, userData.HealthID)
                .input('Approved', sql.Bit, userData.Approved)
                .input('UserID', sql.Int, userId) // Use the UserID from the previous insert
                .query('INSERT INTO Patients (HealthID, UserID, Approved) VALUES (@HealthID, @UserID, @Approved)');

            // Commit the transaction
            await transaction.commit();
            console.log('User and Patient added successfully');
        } catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            console.error('Error adding user and patient:', error);
            throw new Error('Failed to add user and patient');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    } 
}

async function getUnapprovedPatients() {
    const pool = await createPool();

    // SQL query to join Users and Patients tables
    const query = `
        SELECT 
            u.UserType, 
            u.Name, 
            u.Email, 
            u.PhoneNumber, 
            u.DateOfBirth, 
            u.Password, 
            u.Image, 
            p.HealthID,
            p.Approved
        FROM 
            Users u
        JOIN 
            Patients p ON u.UserID = p.UserID
        WHERE 
            p.Approved = 0
    `;

    try {
        const result = await pool.request().query(query);
        console.log('Unapproved patients query successful:', result.recordset);
        return result.recordset; // Return the fetched data as an array
    } catch (err) {
        console.error('Query failed:', err);
        throw err; // Optionally throw the error to be handled by the calling function
    }
}

async function approvePatient(healthID) {
    const pool = await createPool();
    
    try {
        await testConnection(pool); 
        console.log("Connection successful");

        // Query to find the user by HealthID and update the Approved status
        const result = await pool.request()
            .input('HealthID', sql.NVarChar, healthID)
            .query(`
                UPDATE Patients 
                SET Approved = 1 
                WHERE HealthID = @HealthID
            `);
        
        // Check if any rows were affected
        if (result.rowsAffected[0] === 0) {
            console.log(`No patient found with HealthID: ${healthID}`);
            return { success: false, message: 'No patient found or already approved' };
        }

        console.log(`Patient with HealthID: ${healthID} approved successfully.`);
        return { success: true, message: 'Patient approved successfully' };
        
    } catch (error) {
        console.error('Error approving user:', error);
        throw error; // Rethrow the error for handling in the calling function
    } finally {
        // Close the connection
        await sql.close();
    }
}

//Raghav
async function getExams() {
    const pool = await createPool();

    // SQL query to join Users and Patients tables
    const query = `
        SELECT * FROM Exams;
    `;

    try {
        const result = await pool.request().query(query);
        console.log('Unapproved patients query successful:', result.recordset);
        return result.recordset; // Return the fetched data as an array
    } catch (err) {
        console.error('Query failed:', err);
        throw err; // Optionally throw the error to be handled by the calling function
    }
}

// Function to add a doctor
async function addExams(examData) {
    const pool = await createPool();
    try {
        // Create a new connection pool
        const pool = await sql.connect(config);
        
        // Start a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Insert user into Users table
            const userInsert = await transaction.request()
                .input('ExanType', sql.NVarChar, examData.ExamType)
                .input('ExamDate', sql.Date, examData.ExamDate)
                .input('DoctorID', sql.NVarChar, examData.DoctorID)
                .input('HealthID', sql.NVarChar, examData.HealthID)
                .query('INSERT INTO Exams (ExanType, ExamDate, DoctorID, HealthID) VALUES (@ExamType, @ExamDate, @DoctorID, @HealthID)');

                await transaction.commit();
                console.log('Exams added successfully');

        } catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            console.error('Error adding Exams:', error);
            throw new Error('Failed to add Exams');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    } 
    
}

//Raghav Ends

// Exporting the necessary components
module.exports = {
    sql,
    createPool,
    testConnection,
    getData,
    getAllUsers,
    addDoctor,
    addStaff,
    addExams,
    addAdmin,
    addPatient,
    getUnapprovedPatients,
    approvePatient,
    getExams,
};

