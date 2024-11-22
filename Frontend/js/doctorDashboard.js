// Sample data for patient alerts
const alerts = [
    { patient: "John Doe", test: "Liver Function", result: "Abnormal" },
    { patient: "Jane Smith", test: "Renal Function", result: "Abnormal" },
    { patient: "Sam Wilson", test: "Tumor Markers", result: "Abnormal" }
];

// Display alerts in the dashboard
const alertsList = document.getElementById("alertsList");
alerts.forEach(alert => {
    const listItem = document.createElement("li");
    listItem.textContent = `${alert.patient} - ${alert.test}: ${alert.result}`;
    alertsList.appendChild(listItem);
});

// Handling form submission for setting up health monitoring
const monitoringForm = document.getElementById("monitoringForm");
monitoringForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const patientName = document.getElementById("patientName").value;
    const monitoringType = document.getElementById("monitoringType").value;
    alert(`Health monitoring set for ${patientName} on ${monitoringType}`);
    const monitoringData = {
        patientName,
        monitoringType
    };
    console.log('Monitoring Data:', monitoringData);
    monitoringForm.reset();
});


// Function to check abnormal results for monitored patients
function checkAbnormalResults(patientName, testType, result) {
    // Check if the test type being monitored is abnormal
    if (result === "Abnormal") {
        // Send an email notification to the doctor
        sendEmailNotification(patientName, testType);
    }
}

// Example of calling the function when a result is returned (this would be done on the results page or backend system)
checkAbnormalResults("John Doe", "Liver Function", "Abnormal"); // Example of an abnormal result
checkAbnormalResults("Jane Smith", "Renal Function", "Normal"); // Example of a normal result
checkAbnormalResults("Sam Wilson", "Tumor Markers", "Abnormal"); // Example of an abnormal result

// Example of integrating with the backend to set monitoring for a patient
function setHealthMonitoring(patientName, monitoringType) {
    // In a real-world application, this would send a POST request to the backend
    fetch('/api/setMonitoring', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientName, monitoringType })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Monitoring set successfully:', data);
    })
    .catch(error => {
        console.error('Error setting monitoring:', error);
    });
}