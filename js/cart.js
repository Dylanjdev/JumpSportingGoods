// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('jumpCart')) || [];

// Display cart items
function displayCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const emptyCartDiv = document.getElementById('empty-cart');
  
  if (cart.length === 0) {
    cartItemsDiv.style.display = 'none';
    emptyCartDiv.style.display = 'block';
    updateSummary();
    return;
  }

  cartItemsDiv.style.display = 'block';
  emptyCartDiv.style.display = 'none';

  cartItemsDiv.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22120%22 height=%22120%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2214%22%3ENo Image%3C/text%3E%3C/svg%3E'">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p><strong>Color:</strong> ${item.color}</p>
        <p><strong>Size:</strong> ${item.size}</p>
        <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <button class="remove-btn" onclick="removeItem(${item.id})">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    </div>
  `).join('');

  updateSummary();
}

// Update quantity
function updateQuantity(itemId, change) {
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeItem(itemId);
    } else {
      localStorage.setItem('jumpCart', JSON.stringify(cart));
      displayCart();
    }
  }
}

// Remove item
function removeItem(itemId) {
  cart = cart.filter(i => i.id !== itemId);
  localStorage.setItem('jumpCart', JSON.stringify(cart));
  displayCart();
  showNotification('Item removed from cart');
}

// Update summary
function updateSummary() {
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 'FREE' : '$0.00';
  const total = subtotal;

  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('shipping').textContent = shipping;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  document.getElementById('modal-total').textContent = `$${total.toFixed(2)}`;
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

// Modal functionality
const modal = document.getElementById('checkout-modal');
const checkoutBtn = document.getElementById('checkout-btn');
const closeBtn = document.querySelector('.close');

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showNotification('Your cart is empty!');
    return;
  }
  modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Handle checkout form submission
document.getElementById('checkout-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    zip: document.getElementById('zip').value,
    payment: document.querySelector('input[name="payment"]:checked').value,
    notes: document.getElementById('notes').value,
    items: cart,
    total: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  };

  // Here you would normally send this to a server
  console.log('Order submitted:', formData);
  
  // Clear cart
  cart = [];
  localStorage.setItem('jumpCart', JSON.stringify(cart));
  
  // Close modal
  modal.style.display = 'none';
  
  // Show success message
  showNotification('Order placed successfully! We\'ll contact you soon.');
  
  // Redirect to home after a delay
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
});

// Initialize
displayCart();

// Set copyright year
document.getElementById('year').textContent = new Date().getFullYear();
