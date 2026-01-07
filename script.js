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

  // Handle hash navigation from homepage
  const hash = window.location.hash.substring(1);
  if (hash) {
    setTimeout(() => {
      const section = document.getElementById(hash);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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

  // Product filtering by customer
  function showAllProducts() {
    const products = document.querySelectorAll('.product');
    const headers = document.querySelectorAll('.category-header');
    const grids = document.querySelectorAll('.products-grid');
    products.forEach(p => p.style.display = 'flex');
    headers.forEach(h => h.style.display = 'block');
    grids.forEach(g => g.style.display = 'grid');
    setTimeout(() => {
      const productsSection = document.querySelector('.products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  function filterByCustomer(customer) {
    const products = document.querySelectorAll('.product');
    const headers = document.querySelectorAll('.category-header');
    const grids = document.querySelectorAll('.products-grid');
    
    // First hide everything
    products.forEach(p => p.style.display = 'none');
    headers.forEach(h => h.style.display = 'none');
    grids.forEach(g => g.style.display = 'none');
    
    let firstVisibleHeader = null;
    
    // Show/hide category headers first
    headers.forEach(h => {
      const customerData = h.getAttribute('data-customer');
      if (customerData && customerData.includes(customer)) {
        h.style.display = 'block';
        if (!firstVisibleHeader) firstVisibleHeader = h;
      }
    });
    
    // Show only products for this specific customer
    products.forEach(p => {
      const customerData = p.getAttribute('data-customer');
      if (customerData && customerData.includes(customer)) {
        p.style.display = 'flex';
        // Show the parent grid
        const parentGrid = p.closest('.products-grid');
        if (parentGrid) parentGrid.style.display = 'grid';
      }
    });
    
    // Scroll to the first visible header or products section
    setTimeout(() => {
      if (firstVisibleHeader) {
        firstVisibleHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const productsSection = document.querySelector('.products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 50);
  }

  const showAllLink = document.querySelector('.filter-link[data-filter="all"]');
  if (showAllLink) {
    showAllLink.addEventListener('click', function(e) {
      e.preventDefault();
      showAllProducts();
      // Remove active class from all customer links
      document.querySelectorAll('.customer-filter').forEach(l => l.classList.remove('active'));
    }, false);
  }

  const customerLinks = document.querySelectorAll('.customer-filter');
  customerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // Remove active class from all links
      customerLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      this.classList.add('active');
      
      const customer = this.getAttribute('data-customer');
      if (customer) {
        filterByCustomer(customer);
      }
    }, false);
  });
});
