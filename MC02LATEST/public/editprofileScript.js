document.addEventListener('DOMContentLoaded', function () {
    const profileForm = document.getElementById('profileForm');
    const descriptionInput = document.getElementById('description');

    fetchUserProfile();

    fetch('http://localhost:3000/getUsername')
      .then(response => response.json())
        .then(data => {
            if (data.username) {
                document.getElementById('usernameSpan').textContent = data.username;
            }
        })
        .catch(error => console.error('Error fetching username:', error));

    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const description = descriptionInput.value;

  
        saveDescription(description);
    });

    function fetchUserProfile() {
        fetch('http://localhost:3000/getUserProfile')
            .then(response => response.json())
            .then(data => {
                if (data.description) {
                    descriptionInput.value = data.description;
                }
            })
            .catch(error => console.error('Error fetching user profile:', error));
    }

    function saveDescription(description) {
        
        const requestBody = {
            description: description
        };

        fetch('http://localhost:3000/saveDescription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (response.ok) {
                console.log('Description saved successfully.');
               
                window.location.href = 'MainPage.html';
            } else {
                console.error('Failed to save description.');
            }
        })
        .catch(error => {
            console.error('Error while saving description:', error);
        });
    }
});

