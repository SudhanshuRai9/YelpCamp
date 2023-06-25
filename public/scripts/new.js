const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = document.getElementById('campgroundForm');
    const formData = new FormData(form);
    const errorElement = document.getElementById('errorElement');

    // Perform AJAX request to submit the form data to the server
    fetch('/campgrounds', {
        method: 'POST',
        body: formData,
        redirect: 'follow',
    })
    .then(async (response) => {
        if (response.ok) {
            // Redirect the user to the "/campgrounds" page
            window.location.href = "/campgrounds";
        } else {
            // Handle error response
            const data = await response.json();
            const errorMessage = data.error;
            errorElement.innerText = errorMessage;
            errorElement.style.color = 'red';
        }
    })
    .catch((err) => {
        console.log("Fetch error->", err);
    })
};
  
// Add an event listener to the form submit button
document.getElementById('submitButton').addEventListener('click', handleFormSubmit);
  