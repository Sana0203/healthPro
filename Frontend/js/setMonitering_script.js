let testPrescriptionCount = 0;

// Patients data
document.getElementById('searchButton').addEventListener('click', function () {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('resultsButtonContainer');

    // Clear previous results
    resultsContainer.innerHTML = '';

    console.log('Fetching patient data from backend...');

    // Fetch data from the backend API
    fetch('http://localhost:5501/api/get_patients')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch patient data from the backend.');
            }
            return response.json();
        })
        .then(data => {
            const filteredPatients = data.filter(patient =>
                patient.HealthID.toString().includes(searchInput) ||
                patient.Name.toLowerCase().includes(searchInput)
            );

            // If no results found
            if (filteredPatients.length === 0) {
                const noResults = document.createElement('div');
                noResults.textContent = 'No results found';
                resultsContainer.appendChild(noResults);
                return;
            }

            // Create buttons for filtered patients
            filteredPatients.forEach(patient => {
                const button = document.createElement('button');
                button.className = 'btn btn-outline-primary m-1';
                button.textContent = `Health ID: ${patient.HealthID}, Name: ${patient.Name}`;

                button.addEventListener('click', function () {
                    document.getElementById('HealthID').value = patient.HealthID;
                    const closeModalButton = document.getElementById('closeSearchModal');
                    if (closeModalButton) closeModalButton.click();
                });

                resultsContainer.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Failed to fetch data from backend:', error);
            alert('Failed to fetch patient data from the backend.');
        });
});

// Fetch and populate monitoring table when the document is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.workID) {
        document.getElementById('DoctorID').value = user.workID;
    } else {
        console.error('WorkID not found or user information is missing.');
    }

    try {
        const response = await fetch('http://localhost:5501/api/get_monitoring');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const monitoringData = await response.json();
        const tableBody = document.querySelector('#MonitoringTable tbody');
        monitoringData.forEach(item => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${item.HealthID}</td>
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

// Handle monitoring form submission
document.getElementById('monitoringForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const HealthID = document.getElementById('HealthID').value;
    const DoctorID = document.getElementById('DoctorID').value || 'D004';
    const MonitorField = document.getElementById('MonitorField').value;

    // Create the data object to send
    const data = {
        HealthID: HealthID,
        DoctorID: DoctorID,
        MonitorField: MonitorField
    };

    console.log(data);

    // Send the data to the API
    fetch('http://localhost:5501/api/add_monitoring', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);

        // Add new row to the monitoring table
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

        document.querySelector('#MonitoringTable tbody').appendChild(newRow);
        document.getElementById('monitoringForm').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
// Delete row
// Delete row with backend connection where HealthID and MonitorField match
function deleteRow(button) {
    const row = button.closest('tr');
    const HealthID = row.cells[0].textContent.trim();  // Get HealthID from the first column
    const DoctorID = row.cells[1].textContent.trim();  // Get DoctorID from the second column
    const MonitorField = row.cells[2].textContent.trim();  // Get MonitorField from the third column

    console.log('HealthID:', HealthID); 
    console.log('DoctorID:', DoctorID);
    console.log('MonitorField:', MonitorField);

    // Prepare the data object for deletion
    const deleteData = {
        HealthID: HealthID,
        DoctorID: DoctorID,
        MonitorField: MonitorField
    };

    console.log('Delete Data Object:', deleteData);

    // Send POST request to the backend (as your backend expects POST)
    fetch('http://localhost:5501/api/delete_monitoring', {
        method: 'DELETE',  // Use POST method as per your backend code
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteData), // Sending dynamic data from the table
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete the monitoring data.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Backend Response:', data); // Log the response from the backend
        row.remove();  // Remove the row from the table after successful deletion
    })
    .catch(error => {
        console.error('Error deleting data:', error);
        alert('Failed to delete the monitoring data.');
    });
}


// Modify row
function modifyRow(button) {
    const row = button.closest('tr');
    const MonitorFieldCell = row.cells[2];
    const currentMonitorField = MonitorFieldCell.textContent.trim();

    // Store the original MonitorField value in the row as a data attribute
    row.setAttribute('data-old-monitor-field', currentMonitorField);

    const select = document.createElement('select');
    select.className = 'form-control';
    select.required = true;

    const options = [
        "Routine Hematology", "Coagulation", "Routine Chemistry",
        "Renal Function", "Liver Function", "Pancreas Function",
        "Endocrinolog", "Tumor Markers"
    ];

    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (optionValue === currentMonitorField) option.selected = true;
        select.appendChild(option);
    });

    MonitorFieldCell.innerHTML = '';
    MonitorFieldCell.appendChild(select);

    button.textContent = 'Save';
    button.setAttribute('onclick', 'saveRow(this)');
}

// Save modified row
function saveRow(button) {
    const row = button.closest('tr');
    const HealthID = row.cells[0].textContent.trim();
    const DoctorID = row.cells[1].textContent.trim();
    const MonitorFieldCell = row.cells[2];
    const select = MonitorFieldCell.querySelector('select');

    const updatedValue = select.value;
    const MonitorField = row.getAttribute('data-old-monitor-field');

    // Update the cell with the new value
    MonitorFieldCell.textContent = updatedValue;

    console.log('HealthID:', HealthID); 
    console.log('DoctorID:', DoctorID);
    console.log('MonitorField:', MonitorField);
    console.log('newMonitorField:', updatedValue);

    const modifyData = {
        HealthID: HealthID,
        DoctorID: DoctorID,
        MonitorField: MonitorField,
        newMonitorField: updatedValue
    };

    console.log('Modify Data Object:', modifyData);

    fetch('http://localhost:5501/api/modify_monitoring', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifyData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log('Data saved successfully:', data.message);
        } else {
            console.error('Unexpected response:', data);
        }
    })
    .catch(error => {
        console.error('Error saving data:', error);
        // Optionally, revert changes if the save fails
        MonitorFieldCell.textContent = MonitorField; // Revert the change
    });

    button.textContent = 'Modify';
    button.setAttribute('onclick', 'modifyRow(this)');
}
