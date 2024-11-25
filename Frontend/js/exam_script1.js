function populateExamTable() {
    const tableBody = document.querySelector('#ExamTable tbody');
    tableBody.innerHTML = ''; // Clear the table before populating

    console.log('Fetching exam data from backend...');

    // Fetch data from the backend API
    fetch('http://localhost:5501/api/exams') // Replace with your actual API URL
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Failed to fetch exam data from the backend.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            
            // Loop through the data and add rows to the table
            data.forEach(exam => {
                console.log('Processing exam:', exam);
                const newRow = tableBody.insertRow();
                
                // Skip ExamID if not needed
                const HealthIDCell = newRow.insertCell(0);
                const DoctorIDCell = newRow.insertCell(1);
                const ExamDateCell = newRow.insertCell(2);
                const ExamTypeCell = newRow.insertCell(3);

                // Format ExamDate as YYYY-MM-DD
                const examDate = new Date(exam.ExamDate);
                const formattedDate = examDate.getFullYear() + '-' + 
                                      String(examDate.getMonth() + 1).padStart(2, '0') + '-' + 
                                      String(examDate.getDate()).padStart(2, '0');

                // Set the cell values
                HealthIDCell.textContent = exam.HealthID;
                DoctorIDCell.textContent = exam.DoctorID;
                ExamDateCell.textContent = formattedDate;
                ExamTypeCell.textContent = exam.ExamType;

                console.log('Row added for exam ID:', exam.ExamID);
            });
        })
        .catch(error => {
            console.error('Failed to fetch data from backend:', error);
            alert('Failed to fetch data from the backend.');
        });
}

// Populate the table initially
populateExamTable();

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user information from local storage
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo && userInfo.workID) {
        document.getElementById('DoctorID').value = userInfo.workID; // Set workID in the element
    } else {
        console.error('WorkID not found or user information is missing.');
    }
});

// Function to handle the search and fetch patient data from the backend
document.getElementById('searchButton').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('resultsButtonContainer');

    // Clear previous results
    resultsContainer.innerHTML = '';

    console.log('Fetching patient data from backend...');

    // Fetch data from the backend API
    fetch('http://localhost:5501/api/get_patientsInfo') // URL to your API route
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Failed to fetch patient data from the backend.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);

            // Filter patients based on search input
            const filteredPatients = data.filter(patient => 
                patient.HealthID.toString().includes(searchInput) || 
                patient.Name.toLowerCase().includes(searchInput)
            );

            // Create buttons for filtered patients
            filteredPatients.forEach(patient => {
                const button = document.createElement('button');
                button.className = 'btn btn-outline-primary m-1';
                button.textContent = `Health ID: ${patient.HealthID}, Name: ${patient.Name}`;
                
                // Add a click event to fill the HealthID input and trigger the close button
                button.addEventListener('click', function() {
                    document.getElementById('HealthID').value = patient.HealthID; // Fill the HealthID input
                    
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
        })
        .catch(error => {
            console.error('Failed to fetch data from backend:', error);
            alert('Failed to fetch patient data from the backend.');
        });
});

// Event listener to close the search modal
document.getElementById('closeSearchModal').addEventListener('click', function() {
    document.getElementById('searchForm').reset();
    document.getElementById('resultsButtonContainer').innerHTML = '';
});

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

document.getElementById("saveExam").addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const HealthID = document.getElementById('HealthID').value;
    const DoctorID = document.getElementById('DoctorID').value || 'D004'; // Default value if not set
    const ExamDate = document.getElementById('ExamDate').value; // Get the value here
    const testInputs = document.querySelectorAll("input[name^='test']:checked");
    const ExamType = Array.from(testInputs).map((input) => input.value).join(", ");

    // Validate required fields
    if (!HealthID || !ExamDate) {
        alert("Please fill out all required fields.");
        return;
    }

    console.log('HealthID:', HealthID);
    console.log('DoctorID:', DoctorID);
    console.log('ExamDate:', ExamDate);
    console.log('ExamType:', ExamType);

    const examData = {
        HealthID: HealthID,
        DoctorID: DoctorID,
        ExamDate: ExamDate,  // Ensure this is the correct format for a SQL Date
        ExamType: ExamType
    };

    // Add new row to the table
    const tableBody = document.querySelector("#ExamTable tbody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${HealthID}</td>
        <td>${DoctorID}</td>
        <td>${ExamDate}</td>
        <td>${ExamType}</td>
    `;

    tableBody.appendChild(newRow);

    // Clear the form
    document.getElementById("ExamForm").reset();

    // Close the modal
    $('#ExamModal').modal('hide'); // Requires jQuery

    // Optionally trigger the click event of the close button
    document.querySelector('.btn-secondary[data-dismiss="modal"]').click();

    
    // Send data to the backend
    fetch('http://localhost:5501/api/add_exams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(examData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Exam saved:', data);
    })
    .catch(error => {
        console.error('Error saving exam to backend:', error);
    });
});

