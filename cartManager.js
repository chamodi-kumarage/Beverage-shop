let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price, quantity) {
    console.log(`Adding to cart: ${name}, Price: ${price}, Quantity: ${quantity}`);
    const priceNum = parseFloat(price);
    // Convert USD to RS (1 USD = 300 RS) for items from index.html
    const priceInRS = name.includes('Blueberry Bliss') || name.includes('Cranberry Crunch') || 
                     name.includes('Rose White Delight') || name.includes('Spice Mango Burst') ||
                     name.includes('Sprite Spark') || name.includes('Whiskey Sour Bites') ||
                     name.includes('French 75 Elegance') || name.includes('Hello Summer Glow') ||
                     name.includes('Manhattan Mix') || name.includes('Drink Combo Deal') ||
                     name.includes('Family Pack') || name.includes('Seasonal Special') 
                     ? priceNum * 300 : priceNum;
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = priceInRS;
    } else {
        cart.push({ name, price: priceInRS, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Current cart:', cart);
}

function getCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    console.log('Cart count:', count);
    return count;
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart cleared');
}