document.addEventListener('DOMContentLoaded', function () {
    const usernameDisplay = document.getElementById('usernameDisplay');

   
    fetchUsername();

    function fetchUsername() {
        fetch('http://localhost:3000/getUsername')
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    usernameDisplay.textContent = data.username;
                }
            })
            .catch(error => console.error('Error fetching username from tempAccounts:', error));
    }
});
