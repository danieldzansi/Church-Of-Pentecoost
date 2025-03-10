// scripts/dashboard.js
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

    let transactions = [];

    // Fetch user data
    let { data: user, error: userError } = await supabase.auth.getUser();
    if (user) {
        userName.textContent = user.email.split("@")[0]; // Display username
    }

    // Fetch financial records
    async function fetchFinancialRecords() {
        let { data, error } = await supabase.from("transactions").select("*");
        if (error) {
            console.error("Error fetching transactions:", error);
            return;
        }

        transactions = data;
        updateDashboard(data);
    }

    // Update dashboard UI
    function updateDashboard(data) {
        let totalIncome = 0, totalExpenses = 0, sundayOffering = 0;

        let recentTransactions = data.slice(-5).reverse(); // Get last 5 transactions

        recentTransactionsBody.innerHTML = recentTransactions
            .map(txn => `
                <tr>
                    <td>${new Date(txn.date).toLocaleDateString()}</td>
                    <td>${txn.description}</td>
                    <td>${txn.category}</td>
                    <td class="${txn.type}">${txn.type.toUpperCase()}</td>
                    <td>$${txn.amount.toFixed(2)}</td>
                </tr>
            `).join("");

        data.forEach(txn => {
            if (txn.type === "income") totalIncome += txn.amount;
            if (txn.type === "expense") totalExpenses += txn.amount;
            if (txn.category === "Sunday Offering") sundayOffering += txn.amount;
        });

        totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
        totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
        netBalanceEl.textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
        sundayOfferingEl.textContent = `$${sundayOffering.toFixed(2)}`;

        updateCharts(data);
    }

    // Initialize Charts
    function updateCharts(data) {
        const ctx1 = document.getElementById("income-expense-chart").getContext("2d");
        const ctx2 = document.getElementById("income-categories-chart").getContext("2d");

        let incomeData = data.filter(t => t.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
        let expenseData = data.filter(t => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);

        new Chart(ctx1, {
            type: "bar",
            data: {
                labels: ["Income", "Expenses"],
                datasets: [{
                    label: "Financial Overview",
                    data: [incomeData, expenseData],
                    backgroundColor: ["#4CAF50", "#F44336"],
                }]
            }
        });

        let categories = {};
        data.filter(t => t.type === "income").forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });

        new Chart(ctx2, {
            type: "pie",
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ["#FF9800", "#2196F3", "#9C27B0", "#009688"],
                }]
            }
        });
    }

    // Open transaction modal
    document.getElementById("quick-add").addEventListener("click", () => {
        transactionModal.style.display = "block";
    });

    // Close modal
    closeModalBtns.forEach(btn => btn.addEventListener("click", () => {
        transactionModal.style.display = "none";
    }));

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
        if (error) {
            alert("Error adding transaction: " + error.message);
            return;
        }

        transactionModal.style.display = "none";
        transactionForm.reset();
        fetchFinancialRecords();
    });

    fetchFinancialRecords();
});
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.querySelector(".sidebar").classList.toggle("active");
});
