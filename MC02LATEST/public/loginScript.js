

console.log("loginScript.js is loaded!");

import { sampleAccounts } from './accountConst.js';


function createTempAccount(username, password) {
    return { username, password };
}


function validateLogin(username, password) {
 
    const tempAccount = createTempAccount(username, password);

    return sampleAccounts.some(account => account.username === tempAccount.username && account.password === tempAccount.password);
}


function handleFormSubmit(event) {
    event.preventDefault(); 
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
 

  
    if (validateLogin(username, password)) {

        saveTempAccount(username, password);
        //window.location.href = 'MainPage.html';
        //saveTempAccount(username, password);
    } else {
    
        alert('Invalid username or password. Please try again.');
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
