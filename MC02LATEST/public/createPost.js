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
            alert('Please fill in all fields');
            return;
        }

        // Send data to server
        var postData = {
            title: title,
            description: description,
            tags: tags,
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
    return title.trim() !== '' && description.trim() !== '';
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

function fetchAccount(){
    return fetch('http://localhost:3000/tempAccounts')
    .then(response => response.json())
}

//function to save upvotes to server
function saveUpvote(postId) {
    fetch(`http://localhost:3000/updateUpvote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
    })
    .then(response => {
        if (response.ok) {
            console.log('Upvote updated');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error updating upvote count on the server:', error);
        alert('Failed to update upvote count on the server. Please try again.');
    });
}

function saveDownvote(postId) {
    fetch(`http://localhost:3000/updateDownvote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
    })
    .then(response => {
        if (response.ok) {
            console.log('Downvote updated');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error updating downvote count on the server:', error);
        alert('Failed to update downvote count on the server. Please try again.');
    });
}

function saveComment(postId, comment) {
    fetch('http://localhost:3000/updateComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId, comment })
    })
    .then(response=> {
        if (response.ok) {
            console.log('Comment updated');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message); // Display the success message
        // Optionally, you can update the UI to reflect the successful addition of the comment
    })
    .catch(error => {
        console.error('Error updating comments:', error);
        alert('Failed to update comment on the server');
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

        var upvoteButton = $('<button class="upvote"><span class="material-symbols-outlined">heart_plus</span></button>');
        var upvoteCountSpan = $('<span class="upvote-count">' + post.upvotes + '</span>'); 
        upvoteButton.append(upvoteCountSpan); 

        upvoteButton.click(function() {
            // Increment upvote count and update UI
            post.upvotes++; // Increment upvote count for this post
            $(this).find('.upvote-count').remove();
            $(this).find('.material-symbols-outlined').after('<span class="upvote-count">' + post.upvotes + '</span>');
            console.log('Upvote added for post:', post.title, 'Upvotes:', post.upvotes);
            saveUpvote(post.id);
            
        });        

        var downvoteButton = $('<button class="downvote"><span class="material-symbols-outlined">heart_minus</span></button>');
        var downvoteCountSpan = $('<span class="downvote-count">' + post.downvotes + '</span>'); 
        downvoteButton.append(downvoteCountSpan); 
        
        downvoteButton.click(function() {
            // Increment downvote count and update UI
            post.downvotes++; // Increment downvote count for this post
             // Update UI to display the updated downvote count
             $(this).find('.downvote-count').remove();
             $(this).find('.material-symbols-outlined').after('<span class="downvote-count">' + post.downvotes + '</span>');
            console.log('Downvote added for post:', post.title, 'Downvotes:', post.downvotes);
            saveDownvote(post.id);
        
        });
        
        postElement.append(upvoteButton);
        postElement.append(downvoteButton);
        postElement.append('</div>');

        postElement.append('<div class="comments">');
        postElement.find('.comments').append('<h4>Comments</h4>');
        post.comments.forEach(comment => {
            var commentElement = $('<p></p>').text(comment);
            postElement.find('.comments').append(commentElement);
        });

        var commentButton = $('<button class="comment"><span class="material-symbols-outlined">add_comment</span></button>');
        commentButton.click(function() {
            
            console.log('Comment clicked for post:', post.title);
            
            // Create the comment form elements
            var commentForm = $('<form class="comment-form"></form>');
            var commentTextArea = $('<textarea placeholder="Write your comment..."></textarea>');
            var submitButton = $('<button type="submit">Submit</button>');

            //submit comment functionality
            submitButton.click(function(event) {
                event.preventDefault();
                var commentText = commentTextArea.val();
                
                var commentWithUsername; // Declare variable to hold comment with username
            
                fetchAccount()
                    .then(tempAccounts => {
                        var username = tempAccounts[0].username; 
                        commentWithUsername = username + ': ' + commentText; 
                        var commentElement = $('<p></p>').text(commentWithUsername);
                        $(this).closest('.post').find('.comments').append(commentElement); 
                        return saveComment(post.id, commentText); 
                    })
                    .then(response => {
                        console.log('Comment added:', commentWithUsername); 
                    })
                    .catch(error => {
                        console.error('Error adding comment:', error);
                        alert('Failed to add comment.');
                    });
            });

            commentForm.append(commentTextArea);
            commentForm.append(submitButton);
            
            $(this).closest('.post').append(commentForm);
            
            $(this).hide();
        });

        postElement.append(commentButton);
        postList.append(postElement);

    });
}

// Call fetchPosts when MainPage.html is loaded
$(document).ready(function() {
    fetchPosts();
});


