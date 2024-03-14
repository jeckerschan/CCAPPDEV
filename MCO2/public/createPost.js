$(document).ready(function() {
    // Toggle tag button active state
    $('.tag-btn').click(function(event) {
        event.preventDefault(); // Prevent the default behavior of the tag button
        $(this).toggleClass('active');
    });

    // Handle form submission
    $('#post-form').submit(function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Extract form data
        var title = $('#title').val();
        var description = $('#description').val();
        var tags = getSelectedTags();

        // Validate form fields
        if (!isValidForm(title, description, tags)) {
            alert('Please fill in all fields and select at least one tag.');
            return;
        }

        // Send data to server
        var postData = {
            title: title,
            description: description,
            tags: tags
        };

        savePostData(postData);
    });
});

// Function to get selected tags
function getSelectedTags() {
    return $('.tag-btn.active').map(function() {
        return $(this).val();
    }).get();
}

// Function to validate form fields
function isValidForm(title, description, tags) {
    return title.trim() !== '' && description.trim() !== '' && tags.length > 0;
}

// Function to save post data
function savePostData(postData) {
    fetch('http://localhost:3000/savePost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Post saved successfully');
            window.location.href = 'MainPage.html'; // Redirect to MainPage.html after successful submission
        } else {
            throw new Error('Error saving post');
        }
    })
    .catch(error => {
        console.error('Error saving post:', error);
        alert('Error saving post. Please try again.');
    });
}

