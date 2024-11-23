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
            `;
        });
    }

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
