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
    monitoringForm.reset();
});
