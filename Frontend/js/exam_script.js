const savedExams = [
    {
        healthId: "H123",
        doctorId: "D456",
        date: "2024-11-18",
        tests: ["Routine Hematology", "Renal Function"]
    },
    {
        healthId: "H789",
        doctorId: "D012",
        date: "2024-11-18",
        tests: ["Liver Function", "Tumor Markers"]
    },
    {
        healthId: "H345",
        doctorId: "D678",
        date: "2024-11-18",
        tests: ["Coagulation", "Routine Chemistry"]
    }
];

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Function to populate the table with saved Exams
// Function to populate the table with data from backend
function populateExamTable() {
    const tableBody = document.querySelector('#ExamTable tbody');
    tableBody.innerHTML = ''; // Clear the table before populating

    // Fetch data from the backend API
    fetch('https://healthpro1-d5axdaa7g9asfvfx.canadacentral-01.azurewebsites.net')
        .then(response => response.json())
        .then(data => {
            // Loop through the data and add rows to the table
            data.forEach(exam => {
                const newRow = tableBody.insertRow();

                // Insert cells into the new row
                const healthIdCell = newRow.insertCell(0);
                const doctorIdCell = newRow.insertCell(1);
                const dateCell = newRow.insertCell(2);
                const prescribedTestsCell = newRow.insertCell(3);

                // Set the cell values
                healthIdCell.textContent = exam.healthId;
                doctorIdCell.textContent = exam.doctorId;
                dateCell.textContent = exam.date;
                prescribedTestsCell.textContent = exam.tests.join(', ');
            });
        })
        .catch(error => {
            console.error('Failed to fetch data from backend:', error);
            alert('Failed to fetch data from the backend.');
        });
        console.log('Fetching data from backend...');
fetch('https://healthpro1-d5axdaa7g9asfvfx.canadacentral-01.azurewebsites.net')
    .then(response => {
        console.log('Response received:', response);
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        // Your code to handle the data...
    })
    .catch(error => {
        console.error('Failed to fetch data from backend:', error);
        alert('Failed to fetch data from the backend.');
    });
}


// Call the function to populate the table when the page loads
populateExamTable();

// Event listener for the save Exam button
document.getElementById('saveExam').addEventListener('click', function() {
    // Get the values from the input fields
    const healthId = document.getElementById('healthId').value;
    const doctorId = document.getElementById('profileWorkID').value; // Doctor ID

    // Get the selected tests
    const tests = [];
    const testCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    testCheckboxes.forEach(function(checkbox) {
        tests.push(checkbox.value);
    });

    // Validation: Check if Health ID, Doctor ID are filled and at least one test is selected
    if (!healthId || healthId.trim() === "") {
        alert('Please enter Health ID.');
        return;
    }
    if (!doctorId || doctorId.trim() === "") {
        alert('Please enter Doctor ID.');
        return;
    }
    if (tests.length === 0) {
        alert('Please select at least one prescribed test.');
        return;
    }

    // Create a new Exam object with the current date
    const newExam = {
        healthId: healthId,
        doctorId: doctorId,
        date: getCurrentDate(),
        tests: tests
    };

    // Add the new Exam to the savedExams array
    savedExams.push(newExam);

    // Repopulate the table to include the new Exam
    populateExamTable();

    // Clear the input fields and checkboxes after saving
    document.getElementById('ExamForm').reset();

    // Close the modal
    $('#ExamModal').modal('hide');

    // Optionally trigger the click event of the close button
    document.querySelector('.btn-secondary[data-dismiss="modal"]').click();

    // Reload the page
    location.reload(); // This will refresh the page

    // Send the new Exam to the backend
    sendExamToBackend(newExam);
});

// Function to send data to the backend using a POST request
function sendExamToBackend(Exam) {
    fetch('https://healthpro1-d5axdaa7g9asfvfx.canadacentral-01.azurewebsites.net', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Exam)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save Exam to backend.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Exam successfully sent to backend:', data);
    })
    .catch(error => {
        console.error('Error sending Exam to backend:', error);
        alert('Failed to save Exam to the server. Please try again later.');
    });
}

// Patients data (Example patients for search functionality)
const patients = [
    { id: 1001, name: 'John Doe' },
    { id: 1002, name: 'Jane Doe' },
    { id: 1003, name: 'Richard Roe' },
    // Add more patients here
];

// Function to handle the search
document.getElementById('searchButton').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('resultsButtonContainer');
    
    // Clear previous results
    resultsContainer.innerHTML = '';

    // Filter patients based on search input
    const filteredPatients = patients.filter(patient => 
        patient.id.toString().includes(searchInput) || 
        patient.name.toLowerCase().includes(searchInput)
    );

    // Create buttons for filtered patients
    filteredPatients.forEach(patient => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary m-1';
        button.textContent = `Health ID: ${patient.id}, Name: ${patient.name}`;
        
        // Add a click event to fill the healthId input and trigger the close button
        button.addEventListener('click', function() {
            document.getElementById('healthId').value = patient.id; // Fill the healthId input
            
            // Trigger the click event on the closeSearchModal button
            document.getElementById('closeSearchModal').click(); // Close the search modal
        });

        resultsContainer.appendChild(button);
    });

    // If no results found, show a message
    if (filteredPatients.length === 0) {
        const noResults = document.createElement('div');
        noResults.textContent = 'No results found';
        resultsContainer.appendChild(noResults);
    }
});

// Event listener to close the search modal
document.getElementById('closeSearchModal').addEventListener('click', function() {
    document.getElementById('searchForm').reset();
    document.getElementById('resultsButtonContainer').innerHTML = '';
});

// On page load, retrieve user information from localStorage
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user information from local storage
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo && userInfo.workID) {
        document.getElementById('profileWorkID').value = userInfo.workID; // Set workID in the element
    } else {
        console.error('WorkID not found or user information is missing.');
    }
});
