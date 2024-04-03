$(document).ready(function() {

    $('.tag-btn').click(function(event) {
        event.preventDefault(); // Prevent the default behavior of the tag button
        $(this).toggleClass('active');
        var tags = getSelectedTags();
        console.log("button clicked: " + tags);
    });

});

function getSelectedTags() {
    return $('.tag-btn.active').map(function() {
        return $(this).val();
    }).get();
}