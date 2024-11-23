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
        
        // Add a click event to fill the HealthID input and trigger the close button
        button.addEventListener('click', function() {
            document.getElementById('HealthID').value = patient.id; // Fill the HealthID input
            
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

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

document.getElementById("saveExam").addEventListener("click", function () {
    // Get form values
    const HealthID = document.getElementById("HealthID").value;
    const DoctorID = document.getElementById("DoctorID").value;
    const ExamDate = document.getElementById("ExamDate").value;
    
    const ExamType = document.getElementById('ExamType').value;

    // // Collect selected test values
    // const testInputs = document.querySelectorAll("input[name^='test']:checked");
    // const ExamType = Array.from(testInputs).map((input) => input.value).join(", ");

    // Validate required fields
    if (!HealthID || !DoctorID || !ExamDate) {
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

    // // Reload the page
    // location.reload(); // This will refresh the page

    // Close the modal
    $('#ExamModal').modal('hide'); // Requires jQuery
});


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("saveExam").addEventListener("click", async function (event) {
        event.preventDefault();

        

        const HealthID = document.getElementById('HealthID');
        const DoctorID = document.getElementById('DoctorID');
        const ExamType = document.getElementById('ExamType') || { value: 'E' };
        const ExamDate = document.getElementById('ExamDate');


        console.log('HealthID:', HealthID);
        console.log('DoctorID:', DoctorID);
        console.log('ExamType:', ExamType);
        console.log('ExamDate:', ExamDate);



        // Check if elements are null
        if (!HealthID || !DoctorID || !ExamType || !ExamDate) {
            console.error('One or more input fields are missing!');
            alert('Please make sure all input fields are available!');
            return;
        }

        const examData = {
            HealthID: HealthID.value,
            DoctorID: DoctorID.value,
            ExamType: ExamType.value,
            ExamDate: ExamDate.value,
        };

        console.log(examData);

        try {
            const response = await fetch('http://localhost:5501/api/add_exams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(examData)
            });
    
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.message}`);
            }
    
            const data = await response.json(); // Parse the response data
            console.log('Exam added successfully1:', data);
            alert("Exam added successfully1!");

            populateExamTable();
    
            return data; // Return the response data if needed
    
        } catch (error) {
            console.error('Error saving exam to backend:', error);
            alert('An error occurred while adding the exam. Please try again later.');
        }
    });
});
