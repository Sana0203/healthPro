document.addEventListener('DOMContentLoaded', () => {
    populateOverview();
    populateUserList();
});

// Function to display overview statistics
function populateOverview() {
    const statsContainer = document.getElementById('stats');
    const stats = [
        { title: 'Total Users', count: 128 },
        { title: 'Active Users', count: 103 },
        { title: 'Pending Approvals', count: 5 }
    ];

    stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.classList.add('stat');
        statElement.innerHTML = `<h3>${stat.title}</h3><p>${stat.count}</p>`;
        statsContainer.appendChild(statElement);
    });
}

// Function to manage the user list
function populateUserList() {
    const userList = document.getElementById('userList');
    const users = [
        { username: 'johndoe', role: 'User', status: 'Active' },
        { username: 'janedoe', role: 'Admin', status: 'Inactive' }
    ];

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        userDiv.innerHTML = `
            <p><strong>${user.username}</strong></p>
            <p>Role: ${user.role}</p>
            <p>Status: ${user.status}</p>
            <button onclick="changeStatus('${user.username}')">Toggle Status</button>
        `;
        userList.appendChild(userDiv);
    });
}

// Function to toggle user status
function changeStatus(username) {
    alert(`Changing status for ${username}`);
    // Placeholder function; add status-changing code here
}
