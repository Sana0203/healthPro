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