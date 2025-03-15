// scripts/reports.js
import { supabase } from "../config/supabase.js";
import { checkAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", async function () {
    checkAuth(); // Ensure user is logged in

    // DOM Elements
    const totalIncomeElem = document.getElementById("total-income");
    const totalExpenseElem = document.getElementById("total-expense");
    const netBalanceElem = document.getElementById("net-balance");
    const reportChartCanvas = document.getElementById("report-chart").getContext("2d");
    const filterDateFrom = document.getElementById("filter-date-from");
    const filterDateTo = document.getElementById("filter-date-to");
    const filterCategory = document.getElementById("filter-category");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const resetFiltersBtn = document.getElementById("reset-filters");

    let transactions = [];

    // Fetch financial records
    async function fetchFinancialRecords() {
        let { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: true });
        if (error) {
            console.error("Error fetching transactions:", error);
            return;
        }

        transactions = data;
        generateReport(data);
        populateCategories(data);
    }

    // Generate financial report
    function generateReport(data) {
        let totalIncome = 0;
        let totalExpense = 0;
        let categoryTotals = {};

        data.forEach(txn => {
            if (txn.type === "income") {
                totalIncome += txn.amount;
            } else if (txn.type === "expense") {
                totalExpense += txn.amount;
            }

            // Group by category
            if (!categoryTotals[txn.category]) {
                categoryTotals[txn.category] = 0;
            }
            categoryTotals[txn.category] += txn.amount;
        });

        totalIncomeElem.textContent = `$${totalIncome.toFixed(2)}`;
        totalExpenseElem.textContent = `$${totalExpense.toFixed(2)}`;
        netBalanceElem.textContent = `$${(totalIncome - totalExpense).toFixed(2)}`;

        generateChart(categoryTotals);
    }

    // Generate report chart
    function generateChart(categoryTotals) {
        if (window.reportChart) {
            window.reportChart.destroy();
        }

        window.reportChart = new Chart(reportChartCanvas, {
            type: "doughnut",
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    label: "Financial Breakdown",
                    data: Object.values(categoryTotals),
                    backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"],
                    borderWidth: 1
                }]
            }
        });
    }

    // Populate categories dropdown
    function populateCategories(data) {
        const uniqueCategories = [...new Set(data.map(txn => txn.category))];
        filterCategory.innerHTML = `<option value="all">All Categories</option>` +
            uniqueCategories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
    }

    // Apply Filters
    applyFiltersBtn.addEventListener("click", function () {
        let filteredData = transactions;

        if (filterDateFrom.value) {
            filteredData = filteredData.filter(txn => new Date(txn.date) >= new Date(filterDateFrom.value));
        }
        if (filterDateTo.value) {
            filteredData = filteredData.filter(txn => new Date(txn.date) <= new Date(filterDateTo.value));
        }
        if (filterCategory.value !== "all") {
            filteredData = filteredData.filter(txn => txn.category === filterCategory.value);
        }

        generateReport(filteredData);
    });

    // Reset Filters
    resetFiltersBtn.addEventListener("click", function () {
        filterDateFrom.value = "";
        filterDateTo.value = "";
        filterCategory.value = "all";

        generateReport(transactions);
    });

    fetchFinancialRecords();
});
