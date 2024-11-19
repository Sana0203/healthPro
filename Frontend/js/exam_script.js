const savedPrescriptions = [
    {
        healthId: "H123",
        doctorId: "D456",
        tests: ["Routine Hematology", "Renal Function"]
    },
    {
        healthId: "H789",
        doctorId: "D012",
        tests: ["Liver Function", "Tumor Markers"]
    },
    {
        healthId: "H345",
        doctorId: "D678",
        tests: ["Coagulation", "Routine Chemistry"]
    }
]; // Array to hold saved prescriptions

// Function to populate the table with saved prescriptions
function populatePrescriptionTable() {
    const tableBody = document.querySelector('#prescriptionTable tbody');
    savedPrescriptions.forEach(prescription => {
        const newRow = tableBody.insertRow();

        // Insert cells into the new row
        const healthIdCell = newRow.insertCell(0);
        const doctorIdCell = newRow.insertCell(1);
        const prescribedTestsCell = newRow.insertCell(2);

        // Set the cell values
        healthIdCell.textContent = prescription.healthId;
        doctorIdCell.textContent = prescription.doctorId;
        prescribedTestsCell.textContent = prescription.tests.join(', ');
    });
}

// Call the function to populate the table when the page loads
populatePrescriptionTable();

// Event listener for the save prescription button
document.getElementById('savePrescription').addEventListener('click', function() {
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
    if (!healthId) {
        alert('Please enter Health ID.');
        return; // Exit the function
    }
    if (!doctorId) {
        alert('Please enter Doctor ID.');
        return; // Exit the function
    }
    if (tests.length === 0) {
        alert('Please select at least one prescribed test.');
        return; // Exit the function
    }

    // Create a new prescription object
    const newPrescription = {
        healthId: healthId,
        doctorId: doctorId,
        tests: tests
    };

    // Add the new prescription to the savedPrescriptions array
    savedPrescriptions.push(newPrescription);

    // Populate the table again to include the new prescription
    const tableBody = document.querySelector('#prescriptionTable tbody');
    const newRow = tableBody.insertRow();

    // Insert cells into the new row
    const healthIdCell = newRow.insertCell(0);
    const doctorIdCell = newRow.insertCell(1);
    const prescribedTestsCell = newRow.insertCell(2);

    // Set the cell values
    healthIdCell.textContent = newPrescription.healthId;
    doctorIdCell.textContent = newPrescription.doctorId;
    prescribedTestsCell.textContent = newPrescription.tests.join(', ');

    // Clear the input fields and checkboxes after saving
    document.getElementById('prescriptionForm').reset();

    // Close the modal
    $('#prescriptionModal').modal('hide');

    // Optionally trigger the click event of the close button
    document.querySelector('.btn-secondary[data-dismiss="modal"]').click();

    // Reload the page
    location.reload(); // This will refresh the page
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
