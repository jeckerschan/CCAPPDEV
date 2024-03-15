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
            window.location.href = 'MainPage.html'; 
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

    var postList = $('#post-list'); 

    postList.empty();

    posts.forEach(post => {
        var postElement = $('<div class="post"></div>');
        postElement.append('<h3>' + post.title + '</h3>');
        postElement.append('<p>' + post.description + '</p>');
        postElement.append('<label>Tags:</label>');
        postElement.append('<a href="Post.html"><button>' + post.tags.join(', ') + '</button></a>');
        postElement.append('<div class="actions">');

        post.upvotes = 0;
        var upvoteButton = $('<button class="upvote"><span class="material-symbols-outlined">heart_plus</span></button>');
        upvoteButton.click(function() {
            // Increment upvote count and update UI
            post.upvotes++; // Increment upvote count for this post
            localStorage.setItem('upvotes_' + post.id, post.upvotes); // Save upvotes count to localStorage
            // Update UI to display the updated upvote count
            $(this).find('.upvote-count').remove();
            $(this).find('.material-symbols-outlined').after('<span class="upvote-count">' + post.upvotes + '</span>');
            console.log('Upvote clicked for post:', post.title, 'Upvotes:', post.upvotes);
        });

        post.downvotes = 0;
        var downvoteButton = $('<button class="downvote"><span class="material-symbols-outlined">heart_minus</span></button>');
        downvoteButton.click(function() {
            post.downvotes ++;
            localStorage.setItem('downvotes_' + post.id, post.downvotes);
            $(this).find('.downvote-count').remove();
            $(this).find('.material-symbols-outlined').after('<span class="downvote-count">' + post.downvotes + '</span>');
            console.log('Downvote clicked for post:', post.title);
        });
        
        postElement.append(upvoteButton);
        postElement.append(downvoteButton);
        postElement.append('</div>');

        postElement.append('<div class="comments">');
        postElement.find('.comments').append('<h4>Comments</h4>');
        var replyButton = $('<button class="reply"><span class="material-symbols-outlined">reply</span></button>');
        replyButton.click(function() {
            // Handle reply button click event
            console.log('Reply clicked for post:', post.title);
        });
        postElement.find('.comments').append(replyButton);
        postElement.append('</div>');

        var commentButton = $('<button class="comment"><span class="material-symbols-outlined">add_comment</span></button>');
        commentButton.click(function() {
            // Handle comment button click event
            console.log('Comment clicked for post:', post.title);
        });
        postElement.append(commentButton);

        postList.append(postElement);
    });
}

// Call fetchPosts when MainPage.html is loaded
$(document).ready(function() {
    fetchPosts();
});


