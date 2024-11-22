const testResults = [
    { id: 1, patientId: 'P001', name: "John Doe", testName: "Blood Test - Routine Hematology", date: "2024-01-15", result: "Normal" },
    { id: 2, patientId: 'P002', name: "Jane Smith", testName: "Liver Function Test", date: "2024-01-20", result: "Abnormal" },
    { id: 3, patientId: 'P003', name: "Jack Kesler", testName: "CT Scan", date: "2024-01-25", result: "Normal" },
    { id: 4, patientId: 'P004', name: "Alice Johnson", testName: "Urine Test", date: "2024-02-05", result: "Normal" },
    { id: 5, patientId: 'P005', name: "William Smith", testName: "X-Ray", date: "2024-02-10", result: "Abnormal" },
    { id: 6, patientId: 'P006', name: "George Oliver", testName: "X-Ray", date: "2024-02-20", result: "Normal" },
    { id: 7, patientId: 'P007', name: "Ellis Harry", testName: "Liver Function Test", date: "2024-10-10", result: "Normal" },
    { id: 8, patientId: 'P008', name: "Jacob Ivy", testName: "CT Scan", date: "2024-01-25", result: "Normal" },
    { id: 9, patientId: 'P009', name: "Edward Thomas", testName: "Urine Test", date: "2024-02-05", result: "Normal" },
    { id: 10, patientId:'P0010',name: "Chin Ken", testName: "X-Ray", date: "2024-02-10", result: "Abnormal" },

];

function filterResults() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const resultsTableBody = document.getElementById('resultsTableBody');
    resultsTableBody.innerHTML = '';

    const filteredResults = testResults.filter(result => {
        const matchesSearch = result.name.toLowerCase().includes(searchInput) || 
                              result.result.toLowerCase().includes(searchInput) ||
                              result.patientId.toLowerCase().includes(searchInput) ||
                              result.testName.toLowerCase().includes(searchInput);
        
        const matchesStatus = statusFilter ? result.result === statusFilter : true;

        return matchesSearch && matchesStatus;
    });

    if (filteredResults.length > 0) {
        filteredResults.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.patientId}</td>
                <td>${result.name}</td>
                <td>${result.testName}</td>
                <td>${result.result}</td>
                <td>${result.date}</td>
            `;
            resultsTableBody.appendChild(row);
        });
    } else {
        resultsTableBody.innerHTML = '<tr><td colspan="5">No results found.</td></tr>';
    }
}
