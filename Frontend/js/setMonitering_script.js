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
    const monitoringFrequency = document.getElementById('monitoringFrequency').value;

    // Create a new row for the table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${healthId}</td>
        <td>${patientName}</td>
        <td>${monitoringType}</td>
        <td>${monitoringFrequency}</td>
    `;

    // Append the new row to the MonitoringTable
    document.querySelector('#MonitoringTable tbody').appendChild(newRow);

    // Optionally, clear the form fields after submission
    document.getElementById('monitoringForm').reset();
});