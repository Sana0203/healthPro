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

                // Set the cell values
                HealthIDCell.textContent = exam.HealthID;
                DoctorIDCell.textContent = exam.DoctorID;
                ExamDateCell.textContent = exam.ExamDate;
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
    fetch('http://localhost:5501/api/get_patients') // URL to your API route
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

document.getElementById("saveExam").addEventListener("click", function () {
    // Get form values
    const HealthID = document.getElementById("HealthID").value;
    const DoctorID = document.getElementById("DoctorID").value;
    const ExamDate = document.getElementById("ExamDate").value;
    
    // const ExamType = document.getElementById('ExamType').value;

    // Collect selected test values
    const testInputs = document.querySelectorAll("input[name^='test']:checked");
    const ExamType = Array.from(testInputs).map((input) => input.value).join(", ");

    // Validate required fields
    if (!HealthID || !ExamDate) {
        alert("Please fill out all required fields.");
        return;
    }

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

    // Optionally trigger the click event of the close button
    document.querySelector('.btn-secondary[data-dismiss="modal"]').click();

    // Close the modal
    $('#ExamModal').modal('hide'); // Requires jQuery

    // Reload the page
    location.reload(); // This will refresh the page
});


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("saveExam").addEventListener("click", async function (event) {
        event.preventDefault();

        const HealthID = document.getElementById('HealthID');
        const DoctorID = document.getElementById('DoctorID') || value('D004');
        const ExamDate = document.getElementById('ExamDate');
        const testInputs = document.querySelectorAll("input[name^='test']:checked");
        const ExamType = Array.from(testInputs).map((input) => input.value).join(", ");
        
        
        console.log('HealthID:', HealthID.value);
        console.log('DoctorID:', DoctorID.value);
        console.log('ExamDate:', ExamDate.value);
        console.log('ExamType:', ExamType);


        const examData = {
            HealthID: "P009",
            DoctorID: "D004",
            ExamDate: ExamDate.value,  // Ensure this is the correct format for a SQL Date
            ExamType: ExamType
        };
        
        // Check if any of the required values are missing or invalid
        console.log(examData);

        fetch('http://localhost:5501/api/add_exams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(examData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error saving exam to backend:', error);
        });
        // Reload the page
        location.reload(); // This will refresh the page
                
    });
});
