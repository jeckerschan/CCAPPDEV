

console.log("loginScript.js is loaded!");

//const { sampleAccounts } = require('./public/accountConst');


function createTempAccount(username, password) {
    return { username, password };
}


function validateLogin(username, password) {
    // Fetch sampleAccounts from the server
    fetch('http://localhost:3000/sampleAccounts')
        .then(response => response.json())
        .then(sampleAccounts => {
            // Validate login using fetched sampleAccounts
            const tempAccount = createTempAccount(username, password);
            return sampleAccounts.some(account => account.username === tempAccount.username && account.password === tempAccount.password);
        })
        .then(isValid => {
            if (isValid) {
                // If login is valid, save temporary account
                saveTempAccount(username, password);
            } else {
                alert('Invalid username or password. Please try again.');
            }
        })
}


function handleFormSubmit(event) {
    event.preventDefault(); 
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
 

  
    if (validateLogin(username, password)) {

        saveTempAccount(username, password);
        //window.location.href = 'MainPage.html';
        //saveTempAccount(username, password);
    }

   
}

function saveTempAccount(username, password) {
    // Create the data object to send to the server
    const data = {
        username,
        password
    };

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
            // If the account was saved successfully, redirect to MainPage.html
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

document.querySelector('form').addEventListener('submit', handleFormSubmit);
