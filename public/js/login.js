const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    login(data);
})

function login(data) {
    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 200) {
            window.location.href = '/products';
        }
        if(!response.ok) {
            response.json().then(data => {
                alert(data.error)
            });
        }
    })
    .catch(err => {
        console.error(err);
    })
}