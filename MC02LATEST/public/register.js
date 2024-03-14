document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("registerForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var confirmPassword = document.getElementById("confirmpassword").value;
        var passwordError = document.getElementById("passwordError");

        if (password !== confirmPassword) {
            passwordError.textContent = "Passwords do not match!";
        } else {
            passwordError.textContent = "";

            // Create an object with username and password
            var data = {
                username: username,
                password: password
            };

            // Send a POST request to add the account
            fetch('http://localhost:3000/addAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    // Account added successfully
                    console.log('Account added successfully.');
                    form.submit(); // Submit the form if the account is added
                } else {
                    // Handle error response
                    console.error('Failed to add account. Server responded with status:', response.status);
                }
            })
            .catch(error => {
                // Handle fetch error
                console.error('Error:', error);
            });
        }
    });
});
