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

// Function to fetch posts from the server
function fetchPosts() {
    fetch('http://localhost:3000/posts')
    .then(response => response.json())
    .then(posts => displayPosts(posts))
    .catch(error => {
        console.error('Error fetching posts:', error);
        alert('Error fetching posts. Please try again.');
    });
}

// Function to display posts on the MainPage.html
function displayPosts(posts) {
    var postList = $('#post-list'); // Assuming there's a container with id 'post-list' on MainPage.html

    posts.forEach(post => {
        var postElement = $('<div class="post"></div>');
        postElement.append('<h3>' + post.title + '</h3>');
        postElement.append('<p>' + post.description + '</p>');
        postElement.append('<label>Tags:</label>');
        postElement.append('<a href="Post.html"><button>' + post.tags.join(', ') + '</button></a>');
        postElement.append('<div class="actions">');
        postElement.append('<button class="upvote"><span class="material-symbols-outlined">heart_plus</span></button>');
        postElement.append('<button class="downvote"><span class="material-symbols-outlined">heart_minus</span></button>');
        postElement.append('</div>');
        
        postElement.append('<div class="comments">');
        postElement.find('.comments').append('<h4>Comments</h4>');
        // Creating a div to encapsulate the buttons
        var buttonsDiv = $('<div>');
        buttonsDiv.append('<button class="upvote"><span class="material-symbols-outlined">heart_plus</span></button>');
        buttonsDiv.append('<button class="downvote"><span class="material-symbols-outlined">heart_minus</span></button>');
        buttonsDiv.append('<button class="reply"><span class="material-symbols-outlined">reply</span></button>');
        // Appending the buttons div to the comments container
        postElement.find('.comments').append(buttonsDiv);
        postElement.append('</div>');
        
        postElement.append('<button class="comment"><span class="material-symbols-outlined">add_comment</span></button>')
        // Add more content as needed

        postList.append(postElement);
    });
}

// Call fetchPosts when MainPage.html is loaded
$(document).ready(function() {
    fetchPosts();
});


