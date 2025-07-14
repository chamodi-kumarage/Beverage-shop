document.addEventListener('DOMContentLoaded', () => {
    // Initialize bubble animation for hero section
    const canvas = document.querySelector('.hero .bubble-canvas');
    let ctx, bubbles = [], animationId;

    function setupCanvas() {
        if (!canvas) {
            console.error('Canvas element not found');
            return false;
        }
        ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas 2D context');
            return false;
        }
        resizeCanvas();
        return true;
    }

    function resizeCanvas() {
        if (canvas && canvas.parentElement) {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initBubbles();
        }
    }

    // Bubble class
    class Bubble {
        constructor() {
            this.x = Math.random() * (canvas.width || 100);
            this.y = Math.random() * (canvas.height || 100);
            this.radius = Math.random() * 20 + 10; // Random size between 10-30px
            this.vx = (Math.random() - 0.5) * 2; // Random velocity
            this.vy = (Math.random() - 0.5) * 2;
        }

        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212, 160, 23, 0.7)'; // Yellow with slight transparency
            ctx.fill();
            ctx.closePath();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off canvas edges
            if (this.x + this.radius > (canvas.width || 100) || this.x - this.radius < 0) {
                this.vx = -this.vx;
            }
            if (this.y + this.radius > (canvas.height || 100) || this.y - this.radius < 0) {
                this.vy = -this.vy;
            }
        }
    }

    // Initialize bubbles
    function initBubbles() {
        bubbles = [];
        for (let i = 0; i < 10; i++) { // 10 bubbles for balanced effect
            bubbles.push(new Bubble());
        }
    }

    // Animation loop
    function animate() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach(bubble => {
            bubble.update();
            bubble.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    // Start animation
    if (setupCanvas()) {
        animate();
    }

    // Resize handler
    window.addEventListener('resize', () => {
        if (setupCanvas()) {
            resizeCanvas();
            if (!animationId) animate();
        }
    });

    // Initialize Vanilla Tilt for 3D animation on hero image
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        VanillaTilt.init(heroImage, {
            max: 15, // Maximum tilt rotation (degrees)
            speed: 400, // Speed of the tilt effect
            glare: true, // Enable glare effect
            'max-glare': 0.3 // Maximum glare opacity
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    if (searchInput && searchButton) {
        function filterItems() {
            const query = searchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.product-card, .offer-card, .menu-item');
            cards.forEach(card => {
                const textElement = card.querySelector('p, h3');
                const text = textElement ? textElement.textContent.toLowerCase() : '';
                card.style.display = text.includes(query) ? 'block' : 'none';
            });
        }

        searchButton.addEventListener('click', filterItems);
        searchInput.addEventListener('input', filterItems); // Real-time filtering
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterItems();
            }
        });
    }

    // Cart functionality
    function updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = getCartCount();
        }
    }

    document.querySelectorAll('.add-to-cart, .add-to-cart-btn, .grab-offer').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const quantityInput = this.parentElement.querySelector('.quantity-input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1; // Default to 1 if no quantity input
            if (quantity >= 1) {
                addToCart(name, price, quantity);
                updateCartCount();
                button.textContent = this.classList.contains('add-to-cart') || this.classList.contains('add-to-cart-btn') ? 'Added!' : 'Offer Grabbed!';
                button.disabled = true;
                setTimeout(() => {
                    button.textContent = this.classList.contains('add-to-cart') || this.classList.contains('add-to-cart-btn') ? 'Add to Cart' : 'Grab Offer';
                    button.disabled = false;
                }, 2000);
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Animation on scroll for cards
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.product-card, .offer-card, .review-card').forEach(card => {
        cardObserver.observe(card);
    });

    // Initialize cart count
    updateCartCount();
});