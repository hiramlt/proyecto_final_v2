let domain = window.location.href
domain = domain.split('/products')[0]

const closeBtn = document.getElementById('close-btn');
const cartBtn = document.getElementById('nav-cart');
const cart_id = cartBtn.getAttribute('data-id');
const welcomeModal = document.querySelector('.welcome-modal');

closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    welcomeModal.open = false;
});

document.getElementById('nav-profile').addEventListener('click', () => {
    window.location.href = `/profile`;
});

document.getElementById('nav-cart').addEventListener('click', () => {
    window.location.href = `/cart`;
});

const admin_btn = document.getElementById('nav-admin')

if (admin_btn) {
    admin_btn.addEventListener('click', () => {
        window.location.href = `/admin-panel`;
    });
}

const product_btns = document.querySelectorAll('.btn-cart');
product_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const product_id = btn.parentElement.getAttribute('data-id');
        const quantity = btn.parentElement.querySelector('#quantity').value;

        addProduct(product_id, quantity);
    });
});

function addProduct(product_id, quantity){
    fetch(`${domain}/api/carts/${cart_id}/product/${product_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ quantity: Number(quantity) })
    })
    .then(response => {
        if (response.ok || response.status === 204){
            alert("Se añadio el producto al carrito")
        }
    })
    .catch(error => alert('Error al añadir producto:', error));
}