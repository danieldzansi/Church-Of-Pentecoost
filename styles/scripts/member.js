import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = 'https://wtopxfdjnjqwhtqmwnsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0b3B4ZmRqbmpxd2h0cW13bnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTUzNzQsImV4cCI6MjA1NjYzMTM3NH0.8KI_0-GUraxFYLrOauafUfbU2ZxCCPylEN2EJ0EDwww';  // Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to handle form submission for any table
async function handleFormSubmit(event, tableName) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const inputData = Object.fromEntries(formData.entries());

    const { data, error } = await supabase.from(tableName).insert([inputData]);

    if (error) {
        console.error(`Error adding data to ${tableName}:`, error);
        alert(`Failed to add data to ${tableName}!`);
    } else {
        console.log(`Data added to ${tableName}:`, data);
        alert(`Data added successfully to ${tableName}!`);
        event.target.reset();
        
        // Fetch updated data
        fetchData(tableName);
    }
}

// General function to fetch data from any table
async function fetchData(tableName) {
    let { data, error } = await supabase.from(tableName).select("*");

    if (error) {
        console.error(`Error fetching ${tableName}:`, error);
    } else {
        console.log(`Fetched ${tableName}:`, data);
        displayData(tableName, data);
    }
}

// General function to display data in the correct table
function displayData(tableName, data) {
    const tableBodyIdMap = {
        visitors: "visitorsTableBody",
        souls : "SoulsTableBody",
        baptism: "SoulTableBody",
        death: "DeathsTableBody",
        birth: "BirthsTableBody",
        backsliders:"backSlidersTableBody",
        backslider: "backSliderTableBody"
    };

    const tableBody = document.getElementById(tableBodyIdMap[tableName]);
    if (!tableBody) return;
    
    tableBody.innerHTML = ""; // Clear previous entries

    data.forEach(record => {
        let row = "";

        switch (tableName) {
            case "visitors":
                row = `<tr>
                    <td>${record.Name || ''}</td>
                    <td>${record.Contact || ''}</td>
                    <td>${record.Address || ''}</td>
                    <td>${record.Date || ''}</td>
                    <td>${record.InvitedBy || ''}</td>
                </tr>`;
                break;

            case "souls":
                row = `<tr>
                    <td>${record.Name || ''}</td>
                    <td>${record.Contact || ''}</td>
                    <td>${record.Address || ''}</td>
                    <td>${record.Date|| ''}</td>
                    <td>${record.ConvertedBy || ''}</td>
                </tr>`;
                break;

            case "baptism":
                row = `<tr>
                    
                    <td>${record.Name || ''}</td>
                    <td>${record.Contact || ''}</td>
                    <td>${record.Date || ''}</td>
                    <td>${record.BaptizedBy || ''}</td>
                </tr>`;
                break;

            case "death":
                row = `<tr>
                    
                    <td>${record.Name || ''}</td>
                    <td>${record.Contact || ''}</td>
                    <td>${record.Date || ''}</td>
                    <td>${record.Cause || ''}</td>
                    <td>${record.FamilyContact || ''}</td>
                </tr>`;
                break;

            case "birth":
                row = `<tr>
                    
                    <td>${record.BabyName || ''}</td>
                    <td>${record.ParentsName || ''}</td>
                    <td>${record.Date || ''}</td>
                    <td>${record.Gender || ''}</td>
                    <td>${record.DedicationDate || ''}</td>
                </tr>`;
                break;
            case "backsliders":
                row = `<tr>
                    <td>${record.Name || ''}</td>
                    <td>${record.Contact || ''}</td>
                    <td>${record.Baptism || ''}</td>
                    <td>${record.Location || ''}</td>
                    
                </tr>`;
                break;

                case "backslider":
                    row = `<tr>
                        <td>${record.Name || ''}</td>
                        <td>${record.Contact || ''}</td>
                        <td>${record.Baptism || ''}</td>
                        <td>${record.Location || ''}</td>
                        
                    </tr>`;
                    break;   

        }

        tableBody.innerHTML += row;
    });
}

// Attach event listeners to forms
document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        visitors: 'visitorForm',
        souls: 'soulsForm',
        baptism: 'soulBaptizedForm',
        death: 'deathTableForm',
        birth: 'birthForm',
        backsliders: 'backsliderswonForm',
        backslider: 'backsliderwonForm'  

    };

    for (const [table, formId] of Object.entries(sections)) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (event) => handleFormSubmit(event, table));
        }
    }

    // Fetch data for all sections on page load
    fetchData("visitors");
    fetchData("souls");
    fetchData("baptism");
    fetchData("death");
    fetchData("birth");
    fetchData("backsliders");
    fetchData("backslider");
});
