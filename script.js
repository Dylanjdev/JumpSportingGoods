// Shopping Cart System
let cart = JSON.parse(localStorage.getItem('jumpCart')) || [];

// Update cart count in header
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.cart-count').textContent = count;
}

// Add item to cart
function addToCart(productId) {
  const product = document.getElementById(`product-${productId}`);
  const name = product.querySelector('h3').textContent;
  const price = parseFloat(product.querySelector('.price').textContent.replace('$', ''));
  const color = product.querySelector(`#color-${productId}`).value;
  const size = product.querySelector(`#size-${productId}`).value;
  const quantity = parseInt(product.querySelector(`#quantity-${productId}`).value);
  const image = product.querySelector('img').src;

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(item => 
    item.name === name && item.color === color && item.size === size
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: Date.now(),
      name,
      price,
      color,
      size,
      quantity,
      image
    });
  }

  localStorage.setItem('jumpCart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`${name} added to cart!`);
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Set copyright year
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Add click handlers to cart icon
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

  // Add handlers to all add to cart buttons
  const buttons = document.querySelectorAll('.product button');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      addToCart(index + 1);
    });
  });
});
