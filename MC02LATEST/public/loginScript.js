function validateLogin(username, password) {
    // Make a POST request to validate login
    fetch('http://localhost:3000/validateLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            // If the login is successful, redirect to MainPage.html
            window.location.href = 'MainPage.html';
        } else {
            // If the login fails, display an error message
            alert('Invalid username or password. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while validating login. Please try again later.');
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
            tempAccounts.push({ username, password });
            console.log('Temporary account saved successfully:', { username, password });
            // Redirect to MainPage.html
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
