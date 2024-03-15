document.addEventListener('DOMContentLoaded', function () {
    const cTag = document.querySelector('c');

    
    fetchUsernameFromTempAccounts();

    function fetchUsernameFromTempAccounts() {
        fetch('http://localhost:3000/getUsername')
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    cTag.innerHTML = '&nbsp;' + data.username + '<br><br>';
                }
            })
            .catch(error => console.error('Error fetching username from tempAccounts:', error));
    }
});
