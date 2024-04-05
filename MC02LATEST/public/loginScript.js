



document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');

        validateLogin(username, password); 
    });
});





function validateLogin(username, password) {
  
    console.log("Received username:", username);
    console.log("Received password:", password);

    fetch('http://localhost:3000/sampleAccounts')
        .then(response => response.json())
        .then(sampleAccounts => {
            console.log('Sample Accounts:', sampleAccounts); 
           
            const matchedAccount = sampleAccounts.find(account => account.username === username);
            console.log('Matched Account:', matchedAccount); 
            if (matchedAccount) {
            
                fetch('http://localhost:3000/validateLogin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                })
                .then(response => {
                    if (response.ok) {
                        
                        fetch('http://localhost:3000/tempAccounts')
                            .then(response => response.json())
                            .then(tempAccounts => {
                             
                                saveTempAccount(matchedAccount.username, matchedAccount.password, matchedAccount.accountID);
                            })
                            .catch(error => {
                                console.error('Error fetching tempAccounts:', error);
                                alert('An error occurred while fetching tempAccounts. Please try again later.');
                            });
                    } else {
                      
                        alert('Invalid username or password. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while validating login. Please try again later.');
                });
            } else {
                
                alert('Invalid username or password. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching sampleAccounts:', error);
            alert('An error occurred while fetching account information. Please try again later.');
        });
}

function saveTempAccount(username, password, accountID) {
   
    const data = {
        username,
        password,
        accountID
    };

    console.log('Saving temporary account:', data); 

    
    fetch('http://localhost:3000/saveTempAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            
            fetch('http://localhost:3000/tempAccounts')
                .then(response => response.json())
                .then(tempAccounts => {
                    // Update the tempAccounts variable with the fetched data
                    console.log('Temp Accounts:', tempAccounts);
                    // Proceed with redirection
                    window.location.href = 'MainPage.html';
                })
                .catch(error => {
                    console.error('Error fetching tempAccounts:', error);
                    alert('An error occurred while fetching tempAccounts. Please try again later.');
                });
        } else {
           
            throw new Error('Error saving temporary account');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving temporary account. Please try again.');
    });
}