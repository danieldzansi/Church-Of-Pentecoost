// scripts/records.js
import { supabase } from "../config/supabase.js";
import { checkAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", async function () {
    checkAuth(); // Ensure user is logged in

    // DOM Elements
    const recordsTableBody = document.getElementById("records-table-body");
    const filterDateFrom = document.getElementById("filter-date-from");
    const filterDateTo = document.getElementById("filter-date-to");
    const filterType = document.getElementById("filter-type");
    const filterCategory = document.getElementById("filter-category");
    const filterSearch = document.getElementById("filter-search");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const resetFiltersBtn = document.getElementById("reset-filters");
    const quickAddBtn = document.getElementById("quick-add");
    const transactionForm = document.getElementById("transaction-form");
    const transactionModal = document.getElementById("transaction-modal");
    const closeModalBtns = document.querySelectorAll(".close-modal, .cancel-modal");

    let transactions = [];

    // Fetch and display records
    async function fetchFinancialRecords() {
        let { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
        if (error) {
            console.error("Error fetching transactions:", error);
            return;
        }

        transactions = data;
        displayTransactions(data);
        populateCategories(data);
    }

    // Display transactions in table
    function displayTransactions(data) {
        recordsTableBody.innerHTML = data.map(txn => `
            <tr>
                <td>${new Date(txn.date).toLocaleDateString()}</td>
                <td>${txn.description}</td>
                <td>${txn.category}</td>
                <td class="${txn.type}">${txn.type.toUpperCase()}</td>
                <td>$${txn.amount.toFixed(2)}</td>
                <td>
                    <button class="edit-btn" data-id="${txn.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${txn.id}"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `).join("");

        addEditDeleteEventListeners();
    }

    // Populate categories dropdown dynamically
    function populateCategories(data) {
        const uniqueCategories = [...new Set(data.map(txn => txn.category))];
        filterCategory.innerHTML = `<option value="all">All Categories</option>` +
            uniqueCategories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
    }

    // Apply Filters
    applyFiltersBtn.addEventListener("click", function () {
        let filteredData = transactions;

        // Filter by Date
        if (filterDateFrom.value) {
            filteredData = filteredData.filter(txn => new Date(txn.date) >= new Date(filterDateFrom.value));
        }
        if (filterDateTo.value) {
            filteredData = filteredData.filter(txn => new Date(txn.date) <= new Date(filterDateTo.value));
        }

        // Filter by Type
        if (filterType.value !== "all") {
            filteredData = filteredData.filter(txn => txn.type === filterType.value);
        }

        // Filter by Category
        if (filterCategory.value !== "all") {
            filteredData = filteredData.filter(txn => txn.category === filterCategory.value);
        }

        // Search by Description or Notes
        if (filterSearch.value.trim() !== "") {
            const searchText = filterSearch.value.toLowerCase();
            filteredData = filteredData.filter(txn =>
                txn.description.toLowerCase().includes(searchText) ||
                (txn.notes && txn.notes.toLowerCase().includes(searchText))
            );
        }

        displayTransactions(filteredData);
    });

    // Reset Filters
    resetFiltersBtn.addEventListener("click", function () {
        filterDateFrom.value = "";
        filterDateTo.value = "";
        filterType.value = "all";
        filterCategory.value = "all";
        filterSearch.value = "";

        displayTransactions(transactions);
    });

    // Open transaction modal
    quickAddBtn.addEventListener("click", () => {
        transactionModal.style.display = "block";
    });

    // Close modal
    closeModalBtns.forEach(btn => btn.addEventListener("click", () => {
        transactionModal.style.display = "none";
    }));

    // Handle form submission (Add or Update Transaction)
    transactionForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const id = transactionForm.dataset.id || null;
        const newTransaction = {
            date: document.getElementById("transaction-date").value,
            type: document.getElementById("transaction-type").value,
            category: document.getElementById("transaction-category").value,
            amount: parseFloat(document.getElementById("transaction-amount").value),
            description: document.getElementById("transaction-description").value,
            notes: document.getElementById("transaction-notes").value || null
        };

        let response;
        if (id) {
            response = await supabase.from("transactions").update(newTransaction).eq("id", id);
        } else {
            response = await supabase.from("transactions").insert([newTransaction]);
        }

        if (response.error) {
            alert("Error saving transaction: " + response.error.message);
            return;
        }

        transactionModal.style.display = "none";
        transactionForm.reset();
        fetchFinancialRecords();
    });

    // Add event listeners for edit and delete buttons
    function addEditDeleteEventListeners() {
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", async function () {
                const id = this.dataset.id;
                const txn = transactions.find(t => t.id === id);

                document.getElementById("transaction-date").value = txn.date;
                document.getElementById("transaction-type").value = txn.type;
                document.getElementById("transaction-category").value = txn.category;
                document.getElementById("transaction-amount").value = txn.amount;
                document.getElementById("transaction-description").value = txn.description;
                document.getElementById("transaction-notes").value = txn.notes || "";

                transactionForm.dataset.id = id;
                transactionModal.style.display = "block";
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async function () {
                if (!confirm("Are you sure you want to delete this transaction?")) return;

                const id = this.dataset.id;
                let { error } = await supabase.from("transactions").delete().eq("id", id);

                if (error) {
                    alert("Error deleting transaction: " + error.message);
                    return;
                }

                fetchFinancialRecords();
            });
        });
    }

    fetchFinancialRecords();
});
