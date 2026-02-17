// Shopping Cart System
let cart = JSON.parse(localStorage.getItem('jumpCart')) || [];

// Update cart count in header
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    countEl.textContent = count;
  }
}

// Add item to cart
function addToCart(productElement) {
  const product = productElement.closest('.product');
  const name = product.querySelector('h3').textContent;
  const price = parseFloat(product.querySelector('.price').textContent.replace('$', ''));
  const productId = product.id.replace('product-', '');
  const colorSelect = product.querySelector(`#color-${productId}`);
  const sizeSelect = product.querySelector(`#size-${productId}`);
  const quantityInput = product.querySelector(`#quantity-${productId}`);
  
  const color = colorSelect ? colorSelect.value : 'N/A';
  const size = sizeSelect ? sizeSelect.value : 'N/A';
  const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
  
  // Get the first visible image or the first image
  let imageElement = product.querySelector('img.active') || product.querySelector('img');
  const image = imageElement ? imageElement.src : '';

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

// Flip product image function
function flipImage(button) {
  const container = button.closest('.product-image-container');
  const images = container.querySelectorAll('.flip-image');
  const activeImage = container.querySelector('.flip-image.active');
  const flipText = button.querySelector('.flip-text');
  
  images.forEach(img => {
    if (img.classList.contains('active')) {
      img.classList.remove('active');
      img.style.display = 'none';
    } else {
      img.classList.add('active');
      img.style.display = 'block';
    }
  });
  
  // Update button text
  flipText.textContent = activeImage.dataset.side === 'front' ? 'Front' : 'Back';
}

// Product Modal Functions
function openProductModal(productElement) {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  const product = productElement.closest('.product');
  if (!product) return;

  const name = product.querySelector('h3').textContent;
  const price = product.querySelector('.price').textContent;
  const productId = product.id.replace('product-', '');
  
  // Get the image(s)
  const flipImages = product.querySelectorAll('.flip-image');
  const hasFlipImages = flipImages.length > 1;
  
  let frontImageSrc = '';
  let backImageSrc = '';
  
  if (hasFlipImages) {
    const frontImage = product.querySelector('.flip-image[data-side="front"]');
    const backImage = product.querySelector('.flip-image[data-side="back"]');
    frontImageSrc = frontImage ? frontImage.src : '';
    backImageSrc = backImage ? backImage.src : '';
  } else {
    let imageElement = product.querySelector('img.active') || product.querySelector('img');
    frontImageSrc = imageElement ? imageElement.src : '';
  }
  
  // Get color options
  const colorSelect = product.querySelector(`#color-${productId}`);
  const sizeSelect = product.querySelector(`#size-${productId}`);
  
  // Populate modal
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalPrice').textContent = price;
  document.getElementById('modalImage').src = frontImageSrc;
  document.getElementById('modalImage').alt = name + ' - Front';
  document.getElementById('modalImage').style.display = 'block';
  
  // Handle flip images
  const modalImageBack = document.getElementById('modalImageBack');
  const modalFlipBtn = document.getElementById('modalFlipBtn');
  const modalFlipText = document.querySelector('.modal-flip-text');
  
  if (hasFlipImages && backImageSrc) {
    modalImageBack.src = backImageSrc;
    modalImageBack.alt = name + ' - Back';
    modalImageBack.style.display = 'none';
    modalFlipBtn.style.display = 'flex';
    modalFlipText.textContent = 'Back';
    modal.dataset.currentSide = 'front';
  } else {
    modalImageBack.src = '';
    modalImageBack.style.display = 'none';
    modalFlipBtn.style.display = 'none';
    modal.dataset.currentSide = '';
  }
  
  // Set description (you can customize this)
  document.getElementById('modalDescription').innerHTML = `
    <p>High-quality custom sublimated apparel designed for the Dryden community. 
    Perfect for showing your local pride and supporting Jump Sporting Goods.</p>
    <ul>
      <li>Premium quality materials</li>
      <li>Vibrant, long-lasting colors</li>
      <li>Comfortable fit</li>
      <li>Made to order</li>
    </ul>
  `;
  
  // Populate color options
  const modalColorSelect = document.getElementById('modalColor');
  const modalColorLabel = document.getElementById('modalColorLabel');
  if (colorSelect) {
    modalColorSelect.innerHTML = '';
    Array.from(colorSelect.options).forEach(option => {
      const newOption = document.createElement('option');
      newOption.value = option.value;
      newOption.textContent = option.textContent;
      modalColorSelect.appendChild(newOption);
    });
    modalColorSelect.parentElement.style.display = 'flex';
    modalColorLabel.style.display = 'block';
  } else {
    modalColorSelect.parentElement.style.display = 'none';
    modalColorLabel.style.display = 'none';
  }
  
  // Populate size options
  const modalSizeSelect = document.getElementById('modalSize');
  const modalSizeLabel = document.getElementById('modalSizeLabel');
  if (sizeSelect) {
    modalSizeSelect.innerHTML = '';
    Array.from(sizeSelect.options).forEach(option => {
      const newOption = document.createElement('option');
      newOption.value = option.value;
      newOption.textContent = option.textContent;
      modalSizeSelect.appendChild(newOption);
    });
    modalSizeSelect.parentElement.style.display = 'flex';
    modalSizeLabel.style.display = 'block';
  } else {
    modalSizeSelect.parentElement.style.display = 'none';
    modalSizeLabel.style.display = 'none';
  }
  
  // Reset quantity
  document.getElementById('modalQuantity').value = 1;
  
  // Store product reference for add to cart
  modal.dataset.productId = product.id;
  
  // Show modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Fullscreen image functions
function openFullscreenImage(imageSrc) {
  const overlay = document.getElementById('fullscreenOverlay');
  const fullscreenImage = document.getElementById('fullscreenImage');
  
  if (!overlay || !fullscreenImage) return;
  
  fullscreenImage.src = imageSrc;
  overlay.classList.add('show');
}

function closeFullscreenImage() {
  const overlay = document.getElementById('fullscreenOverlay');
  if (!overlay) return;
  
  overlay.classList.remove('show');
}

// Add to cart from modal
function addToCartFromModal() {
  const modal = document.getElementById('productModal');
  const productId = modal.dataset.productId;
  const product = document.getElementById(productId);
  
  if (!product) return;
  
  const name = document.getElementById('modalTitle').textContent;
  const price = parseFloat(document.getElementById('modalPrice').textContent.replace('$', ''));
  const color = document.getElementById('modalColor').value || 'N/A';
  const size = document.getElementById('modalSize').value || 'N/A';
  const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
  const image = document.getElementById('modalImage').src;
  
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
  closeProductModal();
}

// Initialize modal event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Existing initialization code...
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

  // Product filtering code...
  function showAllProducts(shouldScroll = true) {
    const products = document.querySelectorAll('.product');
    const headers = document.querySelectorAll('.category-header');
    const grids = document.querySelectorAll('.products-grid');
    products.forEach(p => p.style.display = 'flex');
    headers.forEach(h => h.style.display = 'block');
    grids.forEach(g => g.style.display = 'grid');
    if (shouldScroll) {
      setTimeout(() => {
        const productsSection = document.querySelector('.products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
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

  function filterByCategory(categoryId) {
    const products = document.querySelectorAll('.product');
    const headers = document.querySelectorAll('.category-header');
    const grids = document.querySelectorAll('.products-grid');
    const categorySection = document.getElementById(categoryId);

    if (!categorySection) {
      return false;
    }

    const categoryCustomers = Array.from(
      categorySection.querySelectorAll('.customer-filter[data-customer]')
    ).map(link => link.getAttribute('data-customer'));

    if (categoryCustomers.length === 0) {
      return false;
    }

    products.forEach(p => p.style.display = 'none');
    headers.forEach(h => h.style.display = 'none');
    grids.forEach(g => g.style.display = 'none');
    customerLinks.forEach(l => l.classList.remove('active'));

    let firstVisibleHeader = null;

    headers.forEach(h => {
      const customerData = h.getAttribute('data-customer');
      if (customerData && categoryCustomers.includes(customerData)) {
        h.style.display = 'block';
        if (!firstVisibleHeader) {
          firstVisibleHeader = h;
        }
      }
    });

    products.forEach(p => {
      const customerData = p.getAttribute('data-customer');
      if (customerData && categoryCustomers.includes(customerData)) {
        p.style.display = 'flex';
        const parentGrid = p.closest('.products-grid');
        if (parentGrid) {
          parentGrid.style.display = 'grid';
        }
      }
    });

    setTimeout(() => {
      if (firstVisibleHeader) {
        firstVisibleHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);

    return true;
  }

  // Show all products on initial load (without auto-scrolling to first product section)
  showAllProducts(false);

  const showAllLink = document.querySelector('.filter-link[data-filter="all"]');
  if (showAllLink) {
    showAllLink.addEventListener('click', function(e) {
      e.preventDefault();
      showAllProducts(true);
      // Remove active class from all customer links
      document.querySelectorAll('.customer-filter').forEach(l => l.classList.remove('active'));
    }, false);
  }

  const customerLinks = document.querySelectorAll('.customer-filter');

  function activateCustomer(customer) {
    if (!customer) {
      return false;
    }

    const matchingLink = document.querySelector(`.customer-filter[data-customer="${customer}"]`);
    if (!matchingLink) {
      return false;
    }

    customerLinks.forEach(l => l.classList.remove('active'));
    matchingLink.classList.add('active');
    filterByCustomer(customer);
    return true;
  }

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

  function navigateFromHash() {
    const customerFromQuery = new URLSearchParams(window.location.search).get('customer');
    if (activateCustomer(customerFromQuery)) {
      return;
    }

    const hash = window.location.hash.substring(1);
    if (!hash) {
      return;
    }

    if (hash === 'customers') {
      const customersSection = document.getElementById('customers');
      if (customersSection) {
        customersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (filterByCategory(hash)) {
      return;
    }

    const categorySection = document.getElementById(hash);
    if (!categorySection) {
      return;
    }

    categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  navigateFromHash();
  window.addEventListener('hashchange', navigateFromHash);

  // Modal event listeners
  const modal = document.getElementById('productModal');
  if (modal) {
    // Close modal when clicking X
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeProductModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProductModal();
      }
    });
    
    // Add to cart from modal
    const modalAddToCartBtn = document.getElementById('modalAddToCart');
    if (modalAddToCartBtn) {
      modalAddToCartBtn.addEventListener('click', addToCartFromModal);
    }
    
    // Flip image in modal
    const modalFlipBtn = document.getElementById('modalFlipBtn');
    if (modalFlipBtn) {
      modalFlipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modalImage = document.getElementById('modalImage');
        const modalImageBack = document.getElementById('modalImageBack');
        const modalFlipText = document.querySelector('.modal-flip-text');
        const currentSide = modal.dataset.currentSide;
        
        if (currentSide === 'front') {
          modalImage.style.display = 'none';
          modalImageBack.style.display = 'block';
          modalFlipText.textContent = 'Front';
          modal.dataset.currentSide = 'back';
        } else {
          modalImage.style.display = 'block';
          modalImageBack.style.display = 'none';
          modalFlipText.textContent = 'Back';
          modal.dataset.currentSide = 'front';
        }
      });
    }
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const fullscreenOverlay = document.getElementById('fullscreenOverlay');
      if (fullscreenOverlay && fullscreenOverlay.classList.contains('show')) {
        closeFullscreenImage();
      } else {
        closeProductModal();
      }
    }
  });
  
  // Fullscreen image overlay listeners
  const fullscreenOverlay = document.getElementById('fullscreenOverlay');
  if (fullscreenOverlay) {
    const fullscreenClose = document.querySelector('.fullscreen-close');
    const fullscreenImage = document.getElementById('fullscreenImage');
    
    // Close on X button
    if (fullscreenClose) {
      fullscreenClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeFullscreenImage();
      });
    }
    
    // Close on image click
    if (fullscreenImage) {
      fullscreenImage.addEventListener('click', closeFullscreenImage);
    }
    
    // Close on overlay click
    fullscreenOverlay.addEventListener('click', (e) => {
      if (e.target === fullscreenOverlay) {
        closeFullscreenImage();
      }
    });
  }
  
  // Add click listeners to modal images to open fullscreen
  const modalImage = document.getElementById('modalImage');
  const modalImageBack = document.getElementById('modalImageBack');
  
  if (modalImage) {
    modalImage.addEventListener('click', (e) => {
      e.stopPropagation();
      if (modalImage.src && modalImage.style.display !== 'none') {
        openFullscreenImage(modalImage.src);
      }
    });
  }
  
  if (modalImageBack) {
    modalImageBack.addEventListener('click', (e) => {
      e.stopPropagation();
      if (modalImageBack.src && modalImageBack.style.display !== 'none') {
        openFullscreenImage(modalImageBack.src);
      }
    });
  }
  
  // Add click handlers to product images to open modal
  const productImages = document.querySelectorAll('.product img');
  productImages.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductModal(img);
    });
  });
  
  // Add click handlers to product cards (excluding buttons)
  const products = document.querySelectorAll('.product');
  products.forEach(product => {
    product.addEventListener('click', (e) => {
      // Don't open modal if clicking on buttons, selects, or inputs
      if (e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'SELECT' || 
          e.target.tagName === 'INPUT' ||
          e.target.tagName === 'I' ||
          e.target.closest('button')) {
        return;
      }
      openProductModal(product);
    });
  });

  // Add handlers to all add to cart buttons (original functionality)
  const buttons = document.querySelectorAll('.product button:not(.flip-btn):not(.view-shirt-btn)');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(button);
    });
  });

  // Image Modal/Lightbox functionality
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const captionText = document.getElementById('imageCaption');
  const imageCloseBtn = document.querySelector('.image-modal-close');

  // Handle "View Shirt" button clicks
  document.addEventListener('click', function(e) {
    if (e.target.closest('.view-shirt-btn')) {
      const btn = e.target.closest('.view-shirt-btn');
      const imageUrl = btn.getAttribute('data-image');
      const title = btn.getAttribute('data-title');
      
      if (imageUrl && imageUrl.trim() !== '') {
        imageModal.style.display = 'block';
        modalImg.src = imageUrl;
        captionText.textContent = title || '';
      } else {
        alert('Image not available yet. Please contact us for product images.');
      }
    }
    
    // Also handle clicks on images within products (for backwards compatibility)
    if (e.target.tagName === 'IMG' && e.target.closest('.product')) {
      const img = e.target;
      // Don't open modal for logo or very small images
      if (img.naturalWidth > 100 && img.naturalHeight > 100 && !e.target.closest('.view-shirt-btn')) {
        imageModal.style.display = 'block';
        modalImg.src = img.src;
        // Try to get product name for caption
        const product = img.closest('.product');
        const productName = product ? product.querySelector('h3')?.textContent : '';
        captionText.textContent = productName || '';
      }
    }
  });

  // Close modal when X is clicked
  if (imageCloseBtn) {
    imageCloseBtn.addEventListener('click', function() {
      imageModal.style.display = 'none';
    });
  }

  // Close modal when clicking outside the image
  if (imageModal) {
    imageModal.addEventListener('click', function(e) {
      if (e.target === imageModal) {
        imageModal.style.display = 'none';
      }
    });
  }

  // Close image modal with Escape key (in addition to other modal)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && imageModal && imageModal.style.display === 'block') {
      imageModal.style.display = 'none';
    }
  });
});
