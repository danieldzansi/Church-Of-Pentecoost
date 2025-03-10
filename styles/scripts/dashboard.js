// scripts/dashboard.js
import { supabase } from "../config/supabase.js";
import { checkAuth } from "./auth.js";

// Display current date
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = today.toLocaleDateString('en-US', options);
    
    // Transaction modal functionality
    const modal = document.getElementById('transaction-modal');
    const openModalBtn = document.getElementById('quick-add');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelModalBtn = document.querySelector('.cancel-modal');
    
    openModalBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      document.getElementById('transaction-date').valueAsDate = today;
    });
    
    closeModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    cancelModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
    
    // Handle transaction type change
    const transactionType = document.getElementById('transaction-type');
    const categorySelect = document.getElementById('transaction-category');
    
    transactionType.addEventListener('change', () => {
      populateCategories(transactionType.value);
    });
    
    // Populate categories based on transaction type
    function populateCategories(type) {
      categorySelect.innerHTML = '';
      
      let categories = [];
      if (type === 'income') {
        categories = [
          'Tithes', 'Offerings', 'Donations', 'Special Events', 'Fundraising', 'Other Income'
        ];
      } else {
        categories = [
          'Utilities', 'Staff Salary', 'Ministry Expenses', 'Maintenance', 'Missions', 'Supplies', 'Other Expenses'
        ];
      }
      
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase().replace(/\s+/g, '_');
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    }
    
    // Initialize with income categories
    populateCategories('income');
    
    // Mock data for charts (in a real app, this would come from your database)
    renderCharts();
    loadRecentTransactions();
  });
  
  // Function to render charts (mock implementation)
  function renderCharts() {
    // This is a placeholder - in a real app, you'd use Chart.js to render actual charts
    document.getElementById('total-income').textContent = '$5,432.10';
    document.getElementById('total-expenses').textContent = '$3,218.75';
    document.getElementById('net-balance').textContent = '$2,213.35';
    document.getElementById('sunday-offering').textContent = '$1,057.25';
    
    // In a real implementation, you would use:
    // const incomeExpenseChart = new Chart(document.getElementById('income-expense-chart'), { ... });
    // const incomeCategoriesChart = new Chart(document.getElementById('income-categories-chart'), { ... });
  }
  
  // Function to load recent transactions (mock implementation)
  function loadRecentTransactions() {
    const transactions = [
      { date: '2025-03-08', description: 'Sunday Offering', category: 'Offerings', type: 'Income', amount: 1057.25 },
      { date: '2025-03-07', description: 'Electric Bill', category: 'Utilities', type: 'Expense', amount: 243.87 },
      { date: '2025-03-05', description: 'Special Donation', category: 'Donations', type: 'Income', amount: 500.00 },
      { date: '2025-03-03', description: 'Office Supplies', category: 'Supplies', type: 'Expense', amount: 78.32 },
      { date: '2025-03-01', description: 'Staff Salary', category: 'Staff Salary', type: 'Expense', amount: 2500.00 }
    ];
    
    const tbody = document.getElementById('recent-transactions-body');
    tbody.innerHTML = '';
    
    transactions.forEach(transaction => {
      const row = document.createElement('tr');
      
      // Format date
      const date = new Date(transaction.date);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      // Create cells
      row.innerHTML = `
        <td>${formattedDate}</td>
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${transaction.type}</td>
        <td class="${transaction.type.toLowerCase() === 'income' ? 'text-green-500' : 'text-red-500'}">
          ${transaction.type.toLowerCase() === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
        </td>
      `;
      
      tbody.appendChild(row);
    });
  }