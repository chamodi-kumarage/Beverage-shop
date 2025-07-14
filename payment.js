let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-cart">No items in order.</p>';
    } else {
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>RS.${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItemsContainer.appendChild(orderItem);
        });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('orderTotal').textContent = total.toFixed(2);
}

document.getElementById('paymentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputs = document.querySelectorAll('#paymentForm input');
    let hasError = false;
    
    inputs.forEach(input => {
        input.classList.remove('warning');
        if (!input.value.trim()) {
            input.classList.add('warning');
            hasError = true;
        }
    });

    // Additional validation for expiry date (ensure it's a valid month/year)
    const expiryInput = document.getElementById('expiry');
    const today = new Date();
    const [year, month] = expiryInput.value.split('-').map(Number);
    const expiryDate = new Date(year, month - 1);
    if (expiryDate < today) {
        expiryInput.classList.add('warning');
        hasError = true;
    }

    if (!hasError) {
        // Simulate payment processing
        const payButton = document.querySelector('.pay-btn');
        payButton.disabled = true;
        payButton.textContent = 'Processing...';
        
        setTimeout(() => {
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show success message
            alert('Payment successful! Thank you for your order.');
            
            // Redirect to home page
            window.location.href = 'index.html';
        }, 2000);
    } else {
        alert('Please fill in all required fields and ensure the expiry date is valid.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    displayOrderSummary();
    updateCartCount();
});