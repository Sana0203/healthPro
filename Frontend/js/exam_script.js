let testPrescriptionCount = 0;
    
        // Event listener for the save prescription button
        document.getElementById('savePrescription').addEventListener('click', function() {
            // Get the values from the input fields
            const healthId = document.getElementById('healthId').value;
            const doctorId = document.getElementById('doctorId').value;

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

            // Create a new row in the prescription table
            const tableBody = document.querySelector('#prescriptionTable tbody');
            const newRow = tableBody.insertRow();

            // Insert cells into the new row
            const healthIdCell = newRow.insertCell(0);
            const doctorIdCell = newRow.insertCell(1);
            const prescribedTestsCell = newRow.insertCell(2);

            // Set the cell values
            healthIdCell.textContent = healthId;
            doctorIdCell.textContent = doctorId;

            // Format the tests for the Blood Test section
            const bloodTests = [
                "Routine Hematology",
                "Coagulation",
                "Routine Chemistry",
                "Renal Function",
                "Liver Function",
                "Pancreas Function",
                "Endocrinology",
                "Tumor Markers"
            ];

            const selectedBloodTests = tests.filter(test => bloodTests.includes(test));
            const formattedBloodTests = selectedBloodTests.length > 0 ? `Blood Test(${selectedBloodTests.join(', ')})` : '';

            // Add formatted blood tests to the tests array
            const otherTests = tests.filter(test => !bloodTests.includes(test));
            prescribedTestsCell.textContent = [formattedBloodTests, ...otherTests].join(', ').trim();

            // Clear the input fields and checkboxes after saving
            document.getElementById('prescriptionForm').reset();

            // Close the modal
            $('#prescriptionModal').modal('hide');

            // Optionally trigger the click event of the close button
            document.querySelector('.btn-secondary[data-dismiss="modal"]').click();
        });
        // Patients data
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