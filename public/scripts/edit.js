const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');

imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        previewImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = document.getElementById('editForm');
    const formData = new FormData(form);
    const campgroundId = document.getElementById('campground_id').value;
    const errorElement = document.getElementById('errorElement');

    // Perform AJAX request to submit the form data to the server
    fetch(`/campgrounds/${campgroundId}`, {
        method: 'PUT',
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
            console.log("Not Ok response -> ", data);
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
document.getElementById('editButton').addEventListener('click', handleFormSubmit);