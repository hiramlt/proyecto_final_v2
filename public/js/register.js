import config from "../../src/config/config.js";

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    registerUser(data);
})

function registerUser(data) {
    fetch(`${config.domain}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 201) {
            window.location.href = '/login';
        }
        if(!response.ok) {
            response.json().then(data => {
                alert(data.error)
            });
        }
    })
    .catch(err => {
        console.error(err)
    })
}