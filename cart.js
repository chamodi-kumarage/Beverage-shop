document.addEventListener('DOMContentLoaded', () => {
    console.log('cart.js: DOMContentLoaded fired');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('cart.js: Loaded cart from localStorage:', cart);

    function updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            const count = cart.reduce((count, item) => count + item.quantity, 0);
            cartCountElement.textContent = count;
            console.log('cart.js: Updated cart count to', count);
        } else {
            console.error('cart.js: cartCount element not found');
        }
    }

    function updateCartDisplay() {
        console.log('cart.js: Updating cart display');
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) {
            console.error('cart.js: cartItems element not found');
            return;
        }

        cartItemsContainer.innerHTML = '';
        console.log('cart.js: Cleared cartItems container');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            console.log('cart.js: Cart is empty');
        } else {
            cart.forEach((item, index) => {
                console.log(`cart.js: Rendering item ${index}:`, item);
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>Price: RS.${item.price.toFixed(2)}</p>
                        <p>Quantity: <input type="number" min="1" value="${item.quantity}" data-index="${index}"></p>
                    </div>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            console.log('cart.js: Rendered', cart.length, 'cart items');
        }

        updateCartTotal();
        updateCartCount();
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const cartTotalElement = document.getElementById('cartTotal');
        if (cartTotalElement) {
            cartTotalElement.textContent = total.toFixed(2);
            console.log('cart.js: Updated cart total to RS.', total.toFixed(2));
        } else {
            console.error('cart.js: cartTotal element not found');
        }
    }

    function deleteItem(index) {
        console.log('cart.js: Deleting item at index', index);
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('cart.js: Updated cart after deletion:', cart);
        updateCartDisplay();
    }

    // Initial cart display
    updateCartDisplay();

    // Event delegation for quantity changes and delete buttons
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('change', (e) => {
            if (e.target.type === 'number') {
                const index = parseInt(e.target.dataset.index);
                const newQuantity = parseInt(e.target.value);
                console.log('cart.js: Quantity changed for item', index, 'to', newQuantity);
                if (newQuantity >= 1) {
                    cart[index].quantity = newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    console.log('cart.js: Updated cart after quantity change:', cart);
                    updateCartTotal();
                    updateCartCount();
                } else {
                    console.warn('cart.js: Invalid quantity', newQuantity);
                }
            }
        });

        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const index = parseInt(e.target.dataset.index);
                deleteItem(index);
            }
        });
    } else {
        console.error('cart.js: cartItems container not found for event listeners');
    }
});