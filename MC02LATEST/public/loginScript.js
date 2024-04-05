
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');

        validateLogin(username, password); // Call the login validation function
    });
});





function validateLogin(username, password) {
    // Log the received username and password
    console.log("Received username:", username);
    console.log("Received password:", password);

    // Fetch the sampleAccounts
    fetch('http://localhost:3000/sampleAccounts')
        .then(response => response.json())
        .then(sampleAccounts => {
            console.log('Sample Accounts:', sampleAccounts); // Log the fetched sampleAccounts
            // Find the account that matches the provided username
            const matchedAccount = sampleAccounts.find(account => account.username === username);
            console.log('Matched Account:', matchedAccount); // Log the matched account
            if (matchedAccount) {
                // If a matching account is found, make a POST request to validate login
                fetch('http://localhost:3000/validateLogin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                })
                .then(response => {
                    if (response.ok) {
                        // If the login is successful, save the matched account as a temporary account
                        saveTempAccount(matchedAccount.username, matchedAccount.password, matchedAccount.accountID);
                        // Redirect to MainPage.html
                      
                    } else {
                        // If the login fails, display an error message
                        alert('Invalid username or password. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while validating login. Please try again later.');
                });
            } else {
                // If no matching account is found, display an error message
                alert('Invalid username or password. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching sampleAccounts:', error);
            alert('An error occurred while fetching account information. Please try again later.');
        });
}

function saveTempAccount(username, password, accountID) {
    // Create the data object to send to the server
    const data = {
        username,
        password,
        accountID
    };

    console.log('Saving temporary account:', data); // Log the data being sent to the server

    // Make a POST request to save the temporary account
    fetch('http://localhost:3000/saveTempAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            // If the account was saved successfully, add it to the tempAccounts array
            tempAccounts.push({ username, password, accountID });
            console.log('Temporary account saved successfully:', { username, password });
            window.location.href = 'MainPage.html';
        } else {
            // If there was an error, throw an error and handle it in the catch block
            throw new Error('Error saving temporary account');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving temporary account. Please try again.');
    });
}

