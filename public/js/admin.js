const domain = process.env.DOMAIN || 'http://localhost:8080'

const closeBtn = document.getElementById('close-btn');
const confirmBtn = document.getElementById('confirm-btn');
const modal = document.querySelector('.update-modal');
let updated_user_id = null

closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    modal.open = false;
});

confirmBtn.addEventListener('click', (event) => {
    event.preventDefault();
    updateUserRole();
});


const update_btns = document.querySelectorAll('.update-btn');
update_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const user_id = btn.parentElement.getAttribute('data-id');
        modal.open = true;
        updated_user_id = user_id;
    });
});

const delete_btns = document.querySelectorAll('.delete-btn');
delete_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const user_id = btn.parentElement.getAttribute('data-id');
        deleteUser(user_id);
    });
})

function updateUserRole() {
    fetch(`${domain}/api/users/premium/${updated_user_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
    })
    .then(response => {
        if (response.ok || response.status === 200){
            location.reload();
        }
        if(!response.ok) {
            response.json().then(data => {
                alert(data.error)
            });
        }
    })
    .catch(error => alert('Error al eliminar usuario:', error));
}

function deleteUser(user_id) {
    fetch(`${domain}/api/users/${user_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'  
        },
    })
    .then(response => {
        if (response.ok || response.status === 204){
            location.reload();
        }
        if(!response.ok) {
            response.json().then(data => {
                alert(data.error)
            });
        }
    })
    .catch(error => console.error(error));
}