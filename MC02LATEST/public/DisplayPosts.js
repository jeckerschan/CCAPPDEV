document.addEventListener('DOMContentLoaded', function () {
    $(document).ready(function() {
        const accountID = document.getElementById('accountID').value;

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
                accountID: accountID // Include the accountID in postData
            };

            savePostData(postData);
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

        function fetchPostsForCurrentUser(accountID) {
            fetch('http://localhost:3000/posts')
            .then(response => response.json())
            .then(posts => {
                // Filter posts based on the current user's account ID
                const filteredPosts = posts.filter(post => post.accountID === accountID);
                displayPosts(filteredPosts);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                alert('Error fetching posts. Please try again.');
            });
        }

        function fetchAccount() {
            return fetch('http://localhost:3000/getAccount')
            .then(response => response.json())
            .then(accounts => {
                // Assuming the current user's account is the first one in the array
                const currentUserAccount = accounts[0];
                const currentUserAccountId = currentUserAccount.accountID;
                return currentUserAccountId;
            })
            .catch(error => {
                console.error('Error fetching account details:', error);
                alert('Error fetching account details. Please try again.');
            });
        }

        // Placeholder functions for saving upvote, downvote, and comment
        function saveUpvote(postId, upvotes) {
            // Placeholder for saving upvote to the server
        }

        function saveDownvote(postId, downvotes) {
            // Placeholder for saving downvote to the server
        }

        function saveComment(postId, comment) {
            // Placeholder for saving comment to the server
        }

        function displayPosts(posts) {
            var postList = $('#post'); 
            postList.empty();
            posts.forEach(post => {
                var postElement = $('<div class="post"></div>');
                postElement.append('<h3>' + post.title + '</h3>');
                postElement.append('<p>' + post.description + '</p>');
                postElement.append('<label>Tags: </label>');
                postElement.append('<span style ="font-size: 14">' + post.tags.join(', ') + '</span>');
                postElement.append('<div class="actions">');

                var upvoteButton = $('<button class="upvote"><span class="material-symbols-outlined">heart_plus</span></button>');
                var upvoteCountSpan = $('<span class="upvote-count">' + post.upvotes + '</span>'); 
                upvoteButton.append(upvoteCountSpan); 

                upvoteButton.click(function() {
                    // Toggle upvote
                    if ($(this).hasClass('upvoted')) {
                        // Remove upvote
                        post.upvotes--; // Decrement upvote count for this post
                        $(this).removeClass('upvoted');
                    } 
                    else {
                        // Add upvote
                        post.upvotes++; // Increment upvote count for this post
                        $(this).addClass('upvoted');
                    }
                    
                    // Update UI
                    $(this).find('.upvote-count').remove();
                    $(this).find('.material-symbols-outlined').after('<span class="upvote-count">' + post.upvotes + '</span>');
                    console.log('Upvote added for post:', post.title, 'Upvotes:', post.upvotes);
                    
                    // Save upvote
                    saveUpvote(post.id, post.upvotes);
                });

                var downvoteButton = $('<button class="downvote"><span class="material-symbols-outlined">heart_minus</span></button>');
                var downvoteCountSpan = $('<span class="downvote-count">' + post.downvotes + '</span>'); 
                downvoteButton.append(downvoteCountSpan); 
                
                downvoteButton.click(function() {

                    if ($(this).hasClass('downvoted')) {
                        post.downvotes--;
                        $(this).removeClass('downvoted');
                    }
                    else {
                        post.downvotes++;
                        $(this).addClass('downvoted');
                    }

                    $(this).find('.downvote-count').remove();
                    $(this).find('.material-symbols-outlined').after('<span class="downvote-count">' + post.downvotes + '</span>');
                    console.log('Downvote added for post:', post.title, 'Downvotes:', post.downvotes);
                    saveDownvote(post.id, post.downvotes);
                
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
                                return saveComment(post.id, commentWithUsername); 
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
        fetchAccount()
        .then(accountID => {
            // Once the account ID is fetched, fetch posts for the current user
            fetchPostsForCurrentUser(accountID);
        });
    });
});
