const scriptURL = 'https://script.google.com/macros/s/AKfycbxjPyK04lTJiVhJ3Q9PQI9oxXqCBW4JeIj4HD_fdqVfm3Q3PhPm6LMnklVskhM5S6u2dQ/exec';
const form = document.forms['submit-to-google-sheet'];

form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => console.log('Success!', response))
        .catch(error => console.error('Error!', error.message));
});
