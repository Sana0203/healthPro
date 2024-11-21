let testPrescriptionCount = 0;
// Patients data
const patients = [
    { id: 1001, name: 'John Doe' },
    { id: 1002, name: 'Jane Doe' },
    { id: 1003, name: 'Richard Roe' },
    // Add more patients here
];

// Function to handle the search
document.addEventListener('DOMContentLoaded', function() {
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
            
            // Add a click event to fill the healthId and patientName inputs and trigger the close button
            button.addEventListener('click', function() {
                document.getElementById('healthId').value = patient.id; // Fill the healthId input
                document.getElementById('patientName').value = patient.name; // Fill the patientName input
                
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
});

document.getElementById('monitoringForm').addEventListener('submit', function(event) {
    // Prevent the form from submitting the traditional way
    event.preventDefault();

    // Get the values from the form inputs
    const healthId = document.getElementById('healthId').value;
    const patientName = document.getElementById('patientName').value;
    const monitoringType = document.getElementById('monitoringType').value;

    // Create a new row for the table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${healthId}</td>
        <td>${patientName}</td>
        <td>${monitoringType}</td>
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
    const monitoringTypeCell = row.cells[2];
    const currentMonitoringType = monitoringTypeCell.textContent.trim();

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
        if (optionValue === currentMonitoringType) {
            option.selected = true; // Select the current value
        }
        select.appendChild(option);
    });

    // Replace the cell content with the select
    monitoringTypeCell.innerHTML = ''; // Clear the cell
    monitoringTypeCell.appendChild(select); // Add the select

    // Change the Modify button to a Save button
    button.textContent = 'Save';
    button.setAttribute('onclick', 'saveRow(this)'); // Change the onclick to saveRow
}

// Function to save the modified row
function saveRow(button) {
    // Get the row that contains the button
    const row = button.closest('tr');
    
    // Get the selected value from the Monitoring Type select
    const monitoringTypeCell = row.cells[2];
    const select = monitoringTypeCell.querySelector('select');

    // Update the cell with the new value
    monitoringTypeCell.textContent = select.value;

    // Change the Save button back to a Modify button
    button.textContent = 'Modify';
    button.setAttribute('onclick', 'modifyRow(this)'); // Change the onclick back to modifyRow
}
