// Sample data to simulate backend response; replace with dynamic fetching later
const patientData = {
    name: "John Doe",
    lastLogin: "October 29, 2024 - 08:45 AM",
    appointments: [
        { doctor: "Dr. Smith", date: "October 30, 2024", time: "10:00 AM" },
        { doctor: "Dr. John", date: "November 5, 2024", time: "2:00 PM" }
    ],
    healthMonitoring: {
        bloodPressure: "120/80 mmHg",
        heartRate: "72 bpm"
    },
    notifications: [
        "Don't forget to take your medication!",
        "Your lab test results are ready for review."
    ]
};

// Update DOM elements with data
document.addEventListener("DOMContentLoaded", () => {
    // Header details
    document.getElementById("welcomeMessage").textContent = `Welcome, ${patientData.name}`;
    document.getElementById("lastLogin").textContent = `Last Login: ${patientData.lastLogin}`;

    // Appointments
    const appointmentsList = document.getElementById("appointments");
    patientData.appointments.forEach(appointment => {
        const listItem = document.createElement("li");
        listItem.textContent = `${appointment.doctor} - ${appointment.date} - ${appointment.time}`;
        appointmentsList.appendChild(listItem);
    });

    // Health Monitoring
    document.getElementById("bloodPressure").textContent += patientData.healthMonitoring.bloodPressure;
    document.getElementById("heartRate").textContent += patientData.healthMonitoring.heartRate;

    // Additional sections can be filled here in a similar way...
});
