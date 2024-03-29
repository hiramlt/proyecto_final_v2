let domain = window.location.href
domain = domain.split('/set-password')[0]


const passwordForm = document.getElementById('passw-form');

passwordForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    setPassword(data);
})

function setPassword(data) {
    fetch(`${domain}/api/auth/set-password`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 200) {
            window.location.href = '/login';
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