

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
      
        window.location.href = 'MainPage.html';
    } else {
    
        alert('Invalid username or password. Please try again.');
    }

   
}


document.querySelector('form').addEventListener('submit', handleFormSubmit);
