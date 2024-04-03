

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
            const matchedAccount = sampleAccounts.find(account => account.username === tempAccount.username && account.password === tempAccount.password);
            if (matchedAccount) {
                // If login is valid, save temporary account along with its accountID
                saveTempAccount(username, password, matchedAccount.accountID);
            } else {
                alert('Invalid username or password. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching sampleAccounts:', error);
            alert('An error occurred while fetching sampleAccounts. Please try again later.');
        });
}


function handleFormSubmit(event) {
    event.preventDefault(); 
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
 
    validateLogin(username, password);
   
}

function saveTempAccount(username, password, accountID) {
    // Create the data object to send to the server
    const data = {
        username,
        password,
        accountID
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
