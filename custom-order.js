// Update cart count
let cart = JSON.parse(localStorage.getItem('jumpCart')) || [];
const count = cart.reduce((total, item) => total + item.quantity, 0);
document.querySelector('.cart-count').textContent = count;

// Set copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// File upload handling
const fileInput = document.getElementById('design-files');
const fileList = document.getElementById('file-list');
let uploadedFiles = [];

fileInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name} is too large. Maximum file size is 10MB.`);
      return;
    }
    uploadedFiles.push(file);
    addFileToList(file);
  });
});

function addFileToList(file) {
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';
  fileItem.innerHTML = `
    <span><i class="fas fa-file"></i> ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
    <button type="button" onclick="removeFile('${file.name}')">
      <i class="fas fa-times"></i>
    </button>
  `;
  fileList.appendChild(fileItem);
}

function removeFile(fileName) {
  uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
  const fileItems = fileList.querySelectorAll('.file-item');
  fileItems.forEach(item => {
    if (item.textContent.includes(fileName)) {
      item.remove();
    }
  });
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

// Form submission
document.getElementById('custom-order-form').addEventListener('submit', (e) => {
  e.preventDefault();

  // Get selected sizes
  const sizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked'))
    .map(cb => cb.value);

  // Collect form data
  const formData = {
    name: document.getElementById('name').value,
    organization: document.getElementById('organization').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    productType: document.getElementById('product-type').value,
    quantity: document.getElementById('quantity').value,
    deadline: document.getElementById('deadline').value,
    sizes: sizes,
    colors: document.getElementById('colors').value,
    designNotes: document.getElementById('design-notes').value,
    files: uploadedFiles.map(f => f.name),
    submittedAt: new Date().toISOString()
  };

  // Here you would normally send this to a server
  console.log('Custom order submitted:', formData);
  console.log('Uploaded files:', uploadedFiles);

  // Show success message
  showNotification('Quote request submitted! We\'ll contact you within 24 hours.');

  // Reset form after delay
  setTimeout(() => {
    document.getElementById('custom-order-form').reset();
    fileList.innerHTML = '';
    uploadedFiles = [];
    window.location.href = 'home.html';
  }, 2000);
});
