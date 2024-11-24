let testPrescriptionCount = 0;
// Patients data
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
                    console.log(`Button clicked for HealthID: ${patient.HealthID}`); // Debug log
                    document.getElementById('HealthID').value = patient.HealthID; // Fill the HealthID input
                    
                    // Trigger the click event on the closeSearchModal button
                    const closeModalButton = document.getElementById('closeSearchModal');
                    if (closeModalButton) {
                        closeModalButton.click(); // Close the search modal
                    } else {
                        console.warn('closeSearchModal button not found');
                    }
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

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user information from local storage
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo && userInfo.workID) {
        document.getElementById('DoctorID').value = userInfo.workID; // Set workID in the element
    } else {
        console.error('WorkID not found or user information is missing.');
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch data from the API endpoint
        const response = await fetch('http://localhost:5501/api/get_monitoring');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const monitoringData = await response.json();

        // Populate the table with the fetched data
        const tableBody = document.querySelector('#MonitoringTable tbody');
        monitoringData.forEach((item) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${item.PatientID}</td>
                <td>${item.DoctorID}</td>
                <td>${item.MonitorField}</td>
                <td>
                    <button class="btn btn-outline-danger" onclick="modifyRow(this)">Modify</button>
                    <button class="btn btn-outline-danger" onclick="deleteRow(this)">Delete</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });
    } catch (error) {
        console.error('Failed to fetch monitoring data:', error);
    }
});

document.getElementById('monitoringForm').addEventListener('submit', function (event) {
    // Prevent the form from submitting the traditional way
    event.preventDefault();

    // Get the values from the form inputs
    const HealthID = document.getElementById('HealthID').value;
    const DoctorID = document.getElementById('DoctorID').value || 'D004';
    const MonitorField = document.getElementById('MonitorField').value;

    // Create a new row for the table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${HealthID}</td>
        <td>${DoctorID}</td>
        <td>${MonitorField}</td>
        <td>
            <button class="btn btn-outline-danger" onclick="modifyRow(this)">Modify</button>
            <button class="btn btn-outline-danger" onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    // Append the new row to the MonitoringTable
    document.querySelector('#MonitoringTable tbody').appendChild(newRow);

    // Optionally, clear the form fields after submission
    document.getElementById('monitoringForm').reset();
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submit').addEventListener("click", async function (event) {
        event.preventDefault();

        const HealthID = document.getElementById('HealthID');
        const DoctorID = document.getElementById('DoctorID') || value ('P004');
        const MonitorField = document.getElementById('MonitorField').value;
        
        
        console.log('HealthID:', HealthID.value);
        console.log('DoctorID:', DoctorID.value);
        console.log('MonitorField:', MonitorField.value);


        const monitoringData = {
            HealthID: "P010",
            DoctorID: "D004",
            MonitorField: "ECG"  // Ensure this is the correct format for a SQL Date
        };
        
        // Check if any of the required values are missing or invalid
        console.log(monitoringData);

        fetch('http://localhost:5501/api/add_monitoring', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(monitoringData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error saving exam to backend:', error);
        });
        // // Reload the page
        // location.reload(); // This will refresh the page
                
    });
});


// Function to delete a row
function deleteRow(button) {
    // Get the row that contains the button
    const row = button.closest('tr');
    
    // Remove the row from the table
    row.remove();
}

// Function to modify a row
function modifyRow(button) {
    // Get the row that contains the button
    const row = button.closest('tr');
    
    // Get the current value of the Monitoring Type
    const MonitorFieldCell = row.cells[2];
    const currentMonitorField = MonitorFieldCell.textContent.trim();

    // Create a select element for modifying the Monitoring Type
    const select = document.createElement('select');
    select.className = 'form-control'; // Add Bootstrap class for styling
    select.required = true;

    // Array of options for the select dropdown
    const options = [
        "Routine Hematology",
        "Coagulation",
        "Routine Chemistry",
        "Renal Function",
        "Liver Function",
        "Pancreas Function",
        "Endocrinolog",
        "Tumor Markers"
    ];

    // Create options and append to the select
    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (optionValue === currentMonitorField) {
            option.selected = true; // Select the current value
        }
        select.appendChild(option);
    });

    // Replace the cell content with the select
    MonitorFieldCell.innerHTML = ''; // Clear the cell
    MonitorFieldCell.appendChild(select); // Add the select

    // Change the Modify button to a Save button
    button.textContent = 'Save';
    button.setAttribute('onclick', 'saveRow(this)'); // Change the onclick to saveRow
}

// Function to save the modified row
function saveRow(button) {
    // Get the row that contains the button
    const row = button.closest('tr');
    
    // Get the selected value from the Monitoring Type select
    const MonitorFieldCell = row.cells[2];
    const select = MonitorFieldCell.querySelector('select');

    // Update the cell with the new value
    MonitorFieldCell.textContent = select.value;

    // Change the Save button back to a Modify button
    button.textContent = 'Modify';
    button.setAttribute('onclick', 'modifyRow(this)'); // Change the onclick back to modifyRow
}
