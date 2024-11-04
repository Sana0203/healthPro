//resulkts.js

 // Spinner
 var spinner = function () {
    setTimeout(function () {
        if ($('#spinner').length > 0) {
            $('#spinner').removeClass('show');
        }
    }, 1);
};
spinner();
// Line graph for heart rate
var ctx1 = document.getElementById('heartRateLineChart').getContext('2d');
var heartRateLineChart = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
            label: 'Heart Rate (bpm)',
            data: [72, 75, 80, 78, 74, 76, 73, 75, 77, 74],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: false
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        }
    }
});

// Bar graph for blood pressure
var ctx2 = document.getElementById('bloodPressureBarChart').getContext('2d');
var bloodPressureBarChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
            label: 'Blood Pressure (mmHg)',
            data: [120, 122, 119, 121, 118, 119, 120, 123, 121, 120],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: false
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        }
    }
});

// Another line graph for patient performance
var ctx3 = document.getElementById('patientPerformanceLineChart').getContext('2d');
var patientPerformanceLineChart = new Chart(ctx3, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
            label: 'Patient Performance Score',
            data: [90, 88, 92, 87, 91, 85, 89, 94, 88, 90],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: false
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        }
    }
});
