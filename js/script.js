// Shopping Cart System
let cart = JSON.parse(localStorage.getItem('jumpCart')) || [];
let imageModalScrollY = 0;

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
  
  let imageElement = product.querySelector('img.active') || product.querySelector('img');
  const image = imageElement ? imageElement.src : '';

  const existingItemIndex = cart.findIndex(item => 
    item.name === name && item.color === color && item.size === size
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ id: Date.now(), name, price, color, size, quantity, image });
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

// Flip product image
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
  
  const colorSelect = product.querySelector(`#color-${productId}`);
  const sizeSelect = product.querySelector(`#size-${productId}`);
  
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalPrice').textContent = price;
  document.getElementById('modalImage').src = frontImageSrc;
  document.getElementById('modalImage').alt = name + ' - Front';
  document.getElementById('modalImage').style.display = 'block';
  
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
  
  document.getElementById('modalQuantity').value = 1;
  modal.dataset.productId = product.id;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

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
  
  const existingItemIndex = cart.findIndex(item => 
    item.name === name && item.color === color && item.size === size
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ id: Date.now(), name, price, color, size, quantity, image });
  }

  localStorage.setItem('jumpCart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`${name} added to cart!`);
  closeProductModal();
}

// ─────────────────────────────────────────────────────────────
// MAIN INIT
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  function lockImageModalScroll() {
    if (document.body.classList.contains('image-modal-open')) return;
    imageModalScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add('image-modal-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${imageModalScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockImageModalScroll() {
    if (!document.body.classList.contains('image-modal-open')) return;
    document.body.classList.remove('image-modal-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, imageModalScrollY);
  }

  updateCartCount();

  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => { window.location.href = 'cart.html'; });
  }

  // ── Customer filter helpers ──────────────────────────────────

  function customerMatches(customerData, targetCustomer) {
    if (!customerData || !targetCustomer) return false;
    if (targetCustomer === 'lee-high') {
      return customerData === 'lee-high' || customerData.startsWith('lee-high-');
    }
    if (targetCustomer === 'trinity-high') {
      return customerData === 'trinity-high' || customerData.startsWith('trinity-high-');
    }
    if (targetCustomer === 'sports-general') {
      return customerData === 'sports-general' || customerData.startsWith('sports-general-');
    }
    if (targetCustomer === 'dept-corrections') {
      return customerData === 'dept-corrections' || customerData.startsWith('dept-corrections-');
    }
    return customerData === targetCustomer;
  }

  function showAllProducts(shouldScroll = true) {
    // Remove hidden class from everything - use classes NOT display style
    document.querySelectorAll('.product').forEach(p => p.classList.remove('filter-hidden'));
    document.querySelectorAll('.category-header').forEach(h => h.classList.remove('filter-hidden'));
    document.querySelectorAll('.products-grid').forEach(g => g.classList.remove('filter-hidden'));
    if (shouldScroll) {
      setTimeout(() => {
        const sec = document.querySelector('.products');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  function filterByCustomer(customer) {
    // Hide everything first using CSS class (NOT display:none - that breaks Shopify)
    document.querySelectorAll('.product').forEach(p => p.classList.add('filter-hidden'));
    document.querySelectorAll('.category-header').forEach(h => h.classList.add('filter-hidden'));
    document.querySelectorAll('.products-grid').forEach(g => g.classList.add('filter-hidden'));

    let firstVisibleHeader = null;

    document.querySelectorAll('.category-header').forEach(h => {
      if (customerMatches(h.getAttribute('data-customer'), customer)) {
        h.classList.remove('filter-hidden');
        if (!firstVisibleHeader) firstVisibleHeader = h;
      }
    });

    document.querySelectorAll('.product').forEach(p => {
      if (customerMatches(p.getAttribute('data-customer'), customer)) {
        p.classList.remove('filter-hidden');
        const parentGrid = p.closest('.products-grid');
        if (parentGrid) parentGrid.classList.remove('filter-hidden');
      }
    });

    setTimeout(() => {
      const target = firstVisibleHeader || document.querySelector('.products');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function filterByCategory(categoryId) {
    const categorySection = document.getElementById(categoryId);
    if (!categorySection) return false;

    const categoryCustomers = Array.from(
      categorySection.querySelectorAll(':scope > ul > li > .customer-filter[data-customer]')
    ).map(link => link.getAttribute('data-customer'));

    if (categoryCustomers.length === 0) return false;

    document.querySelectorAll('.product').forEach(p => p.classList.add('filter-hidden'));
    document.querySelectorAll('.category-header').forEach(h => h.classList.add('filter-hidden'));
    document.querySelectorAll('.products-grid').forEach(g => g.classList.add('filter-hidden'));
    customerLinks.forEach(l => l.classList.remove('active'));

    let firstVisibleHeader = null;

    document.querySelectorAll('.category-header').forEach(h => {
      const cd = h.getAttribute('data-customer');
      if (cd && categoryCustomers.some(cc => customerMatches(cd, cc))) {
        h.classList.remove('filter-hidden');
        if (!firstVisibleHeader) firstVisibleHeader = h;
      }
    });

    document.querySelectorAll('.product').forEach(p => {
      const cd = p.getAttribute('data-customer');
      if (cd && categoryCustomers.some(cc => customerMatches(cd, cc))) {
        p.classList.remove('filter-hidden');
        const parentGrid = p.closest('.products-grid');
        if (parentGrid) parentGrid.classList.remove('filter-hidden');
      }
    });

    setTimeout(() => {
      if (firstVisibleHeader) firstVisibleHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

    return true;
  }

  // ── Show all on initial load ─────────────────────────────────
  showAllProducts(false);

  // ── Show All button ──────────────────────────────────────────
  const showAllLink = document.querySelector('.filter-link[data-filter="all"]');
  if (showAllLink) {
    showAllLink.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.customer-filter').forEach(l => l.classList.remove('active'));
      showAllProducts(true);
    });
  }

  // ── Sidebar filter links ─────────────────────────────────────
  const customerLinks = document.querySelectorAll('.customer-filter');

  function activateCustomer(customer) {
    if (!customer) return false;
    const matchingLink = document.querySelector(`.customer-filter[data-customer="${customer}"]`);
    if (!matchingLink) return false;
    customerLinks.forEach(l => l.classList.remove('active'));
    matchingLink.classList.add('active');
    filterByCustomer(customer);
    return true;
  }

  customerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const submenuTarget = this.getAttribute('data-submenu-target');
      const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

      if (submenuTarget) {
        const parentItem = this.closest('.customer-has-submenu');
        if (parentItem) {
          const isOpen = parentItem.classList.contains('open');
          document.querySelectorAll('.customer-has-submenu.open').forEach(i => i.classList.remove('open'));
          if (!isOpen) parentItem.classList.add('open');
        }

        if (isMobileViewport) {
          customerLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
          return;
        }
      }

      customerLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      const customer = this.getAttribute('data-customer');
      if (customer) filterByCustomer(customer);
    });
  });

  // ── Hash / URL navigation ────────────────────────────────────
  function navigateFromHash() {
    const customerFromQuery = new URLSearchParams(window.location.search).get('customer');
    if (activateCustomer(customerFromQuery)) return;

    const hash = window.location.hash.substring(1);
    if (!hash) return;

    if (hash === 'customers') {
      const sec = document.getElementById('customers');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const categorySection = document.getElementById(hash);
    if (categorySection && categorySection.classList.contains('customer-category')) {
      customerLinks.forEach(l => l.classList.remove('active'));
      const firstLink = categorySection.querySelector('.customer-filter[data-customer]');
      if (firstLink) firstLink.classList.add('active');
      if (!filterByCategory(hash)) showAllProducts(false);
      return;
    }

    if (filterByCategory(hash)) return;
    if (categorySection) categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  navigateFromHash();
  window.addEventListener('hashchange', navigateFromHash);

  // ── Modal event listeners ────────────────────────────────────
  const modal = document.getElementById('productModal');
  if (modal) {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeProductModal(); });

    const modalAddToCartBtn = document.getElementById('modalAddToCart');
    if (modalAddToCartBtn) modalAddToCartBtn.addEventListener('click', addToCartFromModal);

    const modalFlipBtn = document.getElementById('modalFlipBtn');
    if (modalFlipBtn) {
      modalFlipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modalImage = document.getElementById('modalImage');
        const modalImageBack = document.getElementById('modalImageBack');
        const modalFlipText = document.querySelector('.modal-flip-text');
        if (modal.dataset.currentSide === 'front') {
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

  // ── Fullscreen overlay ───────────────────────────────────────
  const fullscreenOverlay = document.getElementById('fullscreenOverlay');
  if (fullscreenOverlay) {
    const fullscreenClose = document.querySelector('.fullscreen-close');
    const fullscreenImage = document.getElementById('fullscreenImage');
    if (fullscreenClose) fullscreenClose.addEventListener('click', (e) => { e.stopPropagation(); closeFullscreenImage(); });
    if (fullscreenImage) fullscreenImage.addEventListener('click', closeFullscreenImage);
    fullscreenOverlay.addEventListener('click', (e) => { if (e.target === fullscreenOverlay) closeFullscreenImage(); });
  }

  const modalImage = document.getElementById('modalImage');
  const modalImageBack = document.getElementById('modalImageBack');
  if (modalImage) {
    modalImage.addEventListener('click', (e) => {
      e.stopPropagation();
      if (modalImage.src && modalImage.style.display !== 'none') openFullscreenImage(modalImage.src);
    });
  }
  if (modalImageBack) {
    modalImageBack.addEventListener('click', (e) => {
      e.stopPropagation();
      if (modalImageBack.src && modalImageBack.style.display !== 'none') openFullscreenImage(modalImageBack.src);
    });
  }

  // ── Image lightbox (View Shirt buttons) ─────────────────────
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const captionText = document.getElementById('imageCaption');
  const imageCloseBtn = document.querySelector('.image-modal-close');

  function openImageModal(imageUrl, caption = '') {
    if (!imageModal || !modalImg || !captionText) return;
    modalImg.src = imageUrl;
    captionText.textContent = caption;
    imageModal.classList.add('show');
    lockImageModalScroll();
  }

  function closeImageModal() {
    if (!imageModal) return;
    imageModal.classList.remove('show');
    unlockImageModalScroll();
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('.view-shirt-btn')) {
      const btn = e.target.closest('.view-shirt-btn');
      const imageUrl = btn.getAttribute('data-image');
      const title = btn.getAttribute('data-title');
      if (imageUrl && imageUrl.trim() !== '') {
        openImageModal(imageUrl, title || '');
      } else {
        alert('Image not available yet. Please contact us for product images.');
      }
    }

    if (e.target.tagName === 'IMG' && e.target.closest('.product')) {
      const img = e.target;
      if (img.naturalWidth > 100 && img.naturalHeight > 100 && !e.target.closest('.view-shirt-btn')) {
        const product = img.closest('.product');
        const caption = product ? (product.querySelector('h3')?.textContent || '') : '';
        openImageModal(img.src, caption);
      }
    }
  });

  if (imageCloseBtn) {
    imageCloseBtn.addEventListener('click', closeImageModal);
  }
  if (imageModal) {
    imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeImageModal(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal && imageModal.classList.contains('show')) {
      closeImageModal();
    }
  });

  // ── Product card click handlers ──────────────────────────────
  document.querySelectorAll('.product img').forEach(img => {
    img.addEventListener('click', (e) => { e.stopPropagation(); openProductModal(img); });
  });

  document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' ||
          e.target.tagName === 'INPUT'  || e.target.tagName === 'I' ||
          e.target.closest('button')) return;
      openProductModal(product);
    });
  });

  document.querySelectorAll('.product button:not(.flip-btn):not(.view-shirt-btn)').forEach(button => {
    button.addEventListener('click', (e) => { e.stopPropagation(); addToCart(button); });
  });

});