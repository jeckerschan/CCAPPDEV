$(document).ready(function() {
    // Toggle tag button active state
    $('.tag-btn').click(function(event) {
        event.preventDefault(); // Prevent the default behavior of the tag button
        $(this).toggleClass('active');
    });

    $('#post-form').submit(function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        
        // Get form data
        var title = $('#title').val();
        var description = $('#description').val();
        var tags = $('.tag-btn.active').map(function() {
            return $(this).val();
        }).get();
        
        // Validate form fields (you can add your own validation logic)
        if (title.trim() === '' || description.trim() === '' || tags.length === 0) {
            alert('Please fill in all fields and select at least one tag.');
            return;
        }
        
        // Send data to server
        var postData = {
            title: title,
            description: description,
            tags: tags
        };
        
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/savePost',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function(response) {
                console.log('Post saved successfully');
                window.location.href = 'MainPage.html'; // Redirect to MainPage.html after successful submission
            },
            error: function(xhr, status, error) {
                console.error('Error saving post:', error);
                alert('Error saving post. Please try again.');
            }
        });
    });
});
