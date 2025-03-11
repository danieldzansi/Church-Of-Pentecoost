// Mobile sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnMenuToggle = menuToggle.contains(event.target);
      
      if (!isClickInsideSidebar && !isClickOnMenuToggle && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    });
  }
  
  // Set current date
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
  }
  
  // Transaction modal functionality
  const quickAddBtn = document.getElementById('quick-add');
  const transactionModal = document.getElementById('transaction-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const cancelModalBtn = document.querySelector('.cancel-modal');
  
  if (quickAddBtn && transactionModal) {
    quickAddBtn.addEventListener('click', function() {
      transactionModal.style.display = 'flex';
      // Set today's date as default
      const dateInput = document.getElementById('transaction-date');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
      }
    });
  }
  
  if (closeModalBtn && transactionModal) {
    closeModalBtn.addEventListener('click', function() {
      transactionModal.style.display = 'none';
    });
  }
  
  if (cancelModalBtn && transactionModal) {
    cancelModalBtn.addEventListener('click', function() {
      transactionModal.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === transactionModal) {
      transactionModal.style.display = 'none';
    }
  });
  
  // Handle responsive charts
  function resizeCharts() {
    const chartContainers = document.querySelectorAll('.chart-body');
    chartContainers.forEach(container => {
      // If you're using Chart.js or similar, you might need to update charts here
      // For example: container.chart.resize();
    });
  }
  
  // Call on load and resize
  resizeCharts();
  window.addEventListener('resize', resizeCharts);
});