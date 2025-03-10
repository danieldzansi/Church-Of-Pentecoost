// scripts/dashboard.js
import { supabase } from "../config/supabase.js";
import { checkAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    checkAuth();

    // DOM Elements
    const userName = document.getElementById("greeting-name");
    const totalIncomeEl = document.getElementById("total-income");
    const totalExpensesEl = document.getElementById("total-expenses");
    const netBalanceEl = document.getElementById("net-balance");
    const sundayOfferingEl = document.getElementById("sunday-offering");
    const recentTransactionsBody = document.getElementById("recent-transactions-body");
    const transactionForm = document.getElementById("transaction-form");
    const transactionModal = document.getElementById("transaction-modal");
    const sidebar = document.querySelector(".sidebar"); // Select the sidebar element

    // Fetch user
    let { data: user } = await supabase.auth.getUser();
    if (user) userName.textContent = user.email.split("@")[0];

    // Fetch Transactions
    async function fetchFinancialRecords() {
        let { data, error } = await supabase.from("transactions").select("*");
        if (error) return console.error("Error fetching transactions:", error);
        updateDashboard(data);
    }

    // Update Dashboard UI
    function updateDashboard(data) {
        let totalIncome = 0,
            totalExpenses = 0,
            sundayOffering = 0;

        recentTransactionsBody.innerHTML = data
            .slice(-5)
            .reverse()
            .map((txn) => `
                <tr>
                    <td>${new Date(txn.date).toLocaleDateString()}</td>
                    <td>${txn.description}</td>
                    <td>${txn.category}</td>
                    <td class="${txn.type}">${txn.type.toUpperCase()}</td>
                    <td>$${txn.amount.toFixed(2)}</td>
                </tr>`)
            .join("");

        data.forEach(({ type, amount, category }) => {
            if (type === "income") totalIncome += amount;
            if (type === "expense") totalExpenses += amount;
            if (category === "Sunday Offering") sundayOffering += amount;
        });

        totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
        totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
        netBalanceEl.textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
        sundayOfferingEl.textContent = `$${sundayOffering.toFixed(2)}`;

        updateCharts(data);
    }

    // Update Charts
    function updateCharts(data) {
        const ctx1 = document.getElementById("income-expense-chart").getContext("2d");
        const ctx2 = document.getElementById("income-categories-chart").getContext("2d");

        const incomeData = data.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
        const expenseData = data.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

        new Chart(ctx1, {
            type: "bar",
            data: {
                labels: ["Income", "Expenses"],
                datasets: [{ label: "Overview", data: [incomeData, expenseData], backgroundColor: ["#4CAF50", "#F44336"] }],
            },
        });

        const categories = data
            .filter((t) => t.type === "income")
            .reduce((acc, t) => ((acc[t.category] = (acc[t.category] || 0) + t.amount), acc), {});

        new Chart(ctx2, {
            type: "pie",
            data: {
                labels: Object.keys(categories),
                datasets: [{ data: Object.values(categories), backgroundColor: ["#FF9800", "#2196F3", "#9C27B0", "#009688"] }],
            },
        });
    }

    // Handle Modal Toggle
    document.addEventListener("click", (e) => {
        if (e.target.matches("#quick-add")) transactionModal.style.display = "block";
        if (e.target.matches(".close-modal, .cancel-modal")) transactionModal.style.display = "none";
    });

    // Handle Transaction Submission
    transactionForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        let newTransaction = {
            date: document.getElementById("transaction-date").value,
            type: document.getElementById("transaction-type").value,
            category: document.getElementById("transaction-category").value,
            amount: parseFloat(document.getElementById("transaction-amount").value),
            description: document.getElementById("transaction-description").value,
            notes: document.getElementById("transaction-notes").value || null,
        };

        let { error } = await supabase.from("transactions").insert([newTransaction]);
        if (error) return alert("Error adding transaction: " + error.message);

        transactionModal.style.display = "none";
        transactionForm.reset();
        fetchFinancialRecords();
    });

    // Sidebar Toggle for Mobile Responsiveness
    document.getElementById("menu-toggle").addEventListener("click", () => {
        sidebar.classList.toggle("open"); // Toggle the 'open' class on the sidebar
    });

    fetchFinancialRecords();
});