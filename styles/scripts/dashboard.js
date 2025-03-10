import { supabase } from "../config/supabase.js";
import { checkAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", async function () {
    checkAuth(); // Ensure the user is logged in

    // DOM Elements
    const userName = document.getElementById("greeting-name");
    const totalIncomeEl = document.getElementById("total-income");
    const totalExpensesEl = document.getElementById("total-expenses");
    const netBalanceEl = document.getElementById("net-balance");
    const sundayOfferingEl = document.getElementById("sunday-offering");
    const recentTransactionsBody = document.getElementById("recent-transactions-body");
    const transactionForm = document.getElementById("transaction-form");
    const transactionModal = document.getElementById("transaction-modal");
    const closeModalBtns = document.querySelectorAll(".close-modal, .cancel-modal");
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    let transactions = [];

    // Fetch user data
    let { data: user } = await supabase.auth.getUser();
    if (user) {
        userName.textContent = user.email.split("@")[0];
    }

    // Fetch financial records
    async function fetchFinancialRecords() {
        let { data, error } = await supabase.from("transactions").select("*");
        if (error) return console.error("Error fetching transactions:", error);

        transactions = data || [];
        updateDashboard();
    }

    // Update dashboard UI
    function updateDashboard() {
        let totalIncome = 0, totalExpenses = 0, sundayOffering = 0;
        let recentTransactions = transactions.slice(-5).reverse();

        recentTransactionsBody.innerHTML = recentTransactions.map(txn => `
            <tr>
                <td>${new Date(txn.date).toLocaleDateString()}</td>
                <td>${txn.description}</td>
                <td>${txn.category}</td>
                <td class="${txn.type}">${txn.type.toUpperCase()}</td>
                <td>$${txn.amount.toFixed(2)}</td>
            </tr>
        `).join("");

        transactions.forEach(txn => {
            if (txn.type === "income") totalIncome += txn.amount;
            if (txn.type === "expense") totalExpenses += txn.amount;
            if (txn.category === "Sunday Offering") sundayOffering += txn.amount;
        });

        totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
        totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
        netBalanceEl.textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
        sundayOfferingEl.textContent = `$${sundayOffering.toFixed(2)}`;

        updateCharts();
    }

    // Initialize Charts
    function updateCharts() {
        const ctx1 = document.getElementById("income-expense-chart").getContext("2d");
        const ctx2 = document.getElementById("income-categories-chart").getContext("2d");

        let incomeData = transactions.filter(t => t.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
        let expenseData = transactions.filter(t => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);

        let categories = transactions.filter(t => t.type === "income").reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        new Chart(ctx1, {
            type: "bar",
            data: {
                labels: ["Income", "Expenses"],
                datasets: [{ label: "Overview", data: [incomeData, expenseData], backgroundColor: ["#4CAF50", "#F44336"] }]
            }
        });

        new Chart(ctx2, {
            type: "pie",
            data: {
                labels: Object.keys(categories),
                datasets: [{ data: Object.values(categories), backgroundColor: ["#FF9800", "#2196F3", "#9C27B0", "#009688"] }]
            }
        });
    }

    // Open & Close Transaction Modal
    document.getElementById("quick-add").addEventListener("click", () => transactionModal.style.display = "block");
    closeModalBtns.forEach(btn => btn.addEventListener("click", () => transactionModal.style.display = "none"));

    // Handle form submission
    transactionForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        let newTransaction = {
            date: document.getElementById("transaction-date").value,
            type: document.getElementById("transaction-type").value,
            category: document.getElementById("transaction-category").value,
            amount: parseFloat(document.getElementById("transaction-amount").value),
            description: document.getElementById("transaction-description").value,
            notes: document.getElementById("transaction-notes").value || null
        };

        let { error } = await supabase.from("transactions").insert([newTransaction]);
        if (error) return alert("Error: " + error.message);

        transactionModal.style.display = "none";
        transactionForm.reset();
        fetchFinancialRecords();
    });

    // Sidebar Toggle for Mobile
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        document.body.classList.toggle("sidebar-open");
    });

    fetchFinancialRecords();
});
