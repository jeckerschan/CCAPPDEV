function validateLogin(username, password) {
    // Hash the entered password
    hashPassword(password)
        .then(hashedPassword => {
            // Make a POST request to validate login
            fetch('http://localhost:3000/validateLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password: hashedPassword })
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
        })
        .catch(error => {
            console.error('Error hashing password:', error);
            alert('An error occurred while hashing password. Please try again.');
        });
}
