document.addEventListener("DOMContentLoaded", () => {
    const resultsTable = document.getElementById("resultsTable").getElementsByTagName("tbody")[0];

    // Initial mock data for results
    const resultsData = [
        { patientName: "John Doe", examDate: "2024-11-01", examType: "Blood Test", status: "Pending", details: "Routine check" },
        { patientName: "Jane Smith", examDate: "2024-11-02", examType: "Urine Test", status: "Completed", details: "Routine check" }
    ];

    // Function to render results in the table
    function renderResults(data) {
        resultsTable.innerHTML = "";
        data.forEach(result => {
            const row = resultsTable.insertRow();
            row.innerHTML = `
                <td>${result.patientName}</td>
                <td>${result.examDate}</td>
                <td>${result.examType}</td>
                <td>${result.status}</td>
                <td>${result.details}</td>
                 <td>
                    <button class="btn btn-sm btn-primary set-monitoring" data-index="${index}">
                        ${result.monitoring ? "Modify Monitoring" : "Set Monitoring"}
                    </button>
                </td>
            `;
        });
        // Attach event listeners to "Set Monitoring" buttons
        document.querySelectorAll(".set-monitoring").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                openMonitoringModal(index);
            });
        });
    }

        // Open monitoring modal for a specific patient result
        function openMonitoringModal(index) {
            const result = resultsData[index];
            const monitoringModal = document.getElementById("monitoringModal");
            const modalPatientName = document.getElementById("modalPatientName");
            const modalExamType = document.getElementById("modalExamType");
            const saveMonitoringButton = document.getElementById("saveMonitoring");
    
            modalPatientName.textContent = result.patientName;
            modalExamType.textContent = result.examType;
    
            // Show modal
            monitoringModal.style.display = "block";
    
            // Save monitoring function
            saveMonitoringButton.onclick = function () {
                const keyFunction = document.getElementById("keyFunction").value;
                if (keyFunction.trim() === "") {
                    alert("Please specify the key function to monitor.");
                    return;
                }
    
                resultsData[index].monitoring = true;
                resultsData[index].keyFunction = keyFunction;
    
                alert(`Monitoring set for ${result.patientName}: ${keyFunction}`);
                monitoringModal.style.display = "none";
                renderResults(resultsData);
    
                // Simulate email notification for abnormal results
                checkForAbnormalResults(index);
            };
        }
    
        // Check for abnormal results and notify the doctor
    function checkForAbnormalResults(index) {
        const result = resultsData[index];

        // Simulate checking for abnormality (mock logic)
        const isAbnormal = Math.random() < 0.5; // 50% chance of abnormal result for demo

        if (isAbnormal) {
            alert(`Notification: Abnormal result detected for ${result.patientName}. The doctor has been notified.`);
            // Simulate sending email notification
            sendEmailNotification(result);
        }
    }

     // Simulate sending email notification to the doctor
     function sendEmailNotification(result) {
        console.log(`Email sent to doctor: Monitoring result for ${result.patientName} - Key Function: ${result.keyFunction} is abnormal.`);
    }

    // Close modal
    document.getElementById("closeMonitoringModal").addEventListener("click", () => {
        document.getElementById("monitoringModal").style.display = "none";
    });

    // Render initial data
    renderResults(resultsData);

    // Modify existing results
    document.getElementById("modifyResultsForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const patientName = document.getElementById("patientName").value;
        const examType = document.getElementById("examType").value;
        const examResult = document.getElementById("examResult").value;

        alert(`Updated result for ${patientName}, Exam: ${examType}, New Result: ${examResult}`);
        this.reset();
    });

    // Enter new test results
    document.getElementById("enterResultsForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const newPatientName = document.getElementById("newPatientName").value;
        const newExamDate = document.getElementById("newExamDate").value;
        const newExamType = document.getElementById("newExamType").value;
        const newExamDetails = document.getElementById("newExamDetails").value;

        // Add new result to the data array
        resultsData.push({
            patientName: newPatientName,
            examDate: newExamDate,
            examType: newExamType,
            status: "Pending",
            details: newExamDetails
        });

        // Re-render results table with new data
        renderResults(resultsData);

        alert("New test result added successfully.");
        this.reset();
    });
});
