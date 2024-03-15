// Make a GET request to fetch tempaccounts from the server
fetch('https://example.com/tempaccounts')
  .then(response => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the JSON response
    return response.json();
  })
  .then(data => {
    // Store the tempaccounts data in a variable
    const tempAccounts = data;
    // Now you can work with the tempAccounts variable
    console.log(tempAccounts);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  app.get('/posts', (req, res) => {
    res.json(posts);
  });