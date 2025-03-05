import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase Config
const supabase = createClient("https://wtopxfdjnjqwhtqmwnsz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0b3B4ZmRqbmpxd2h0cW13bnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTUzNzQsImV4cCI6MjA1NjYzMTM3NH0.8KI_0-GUraxFYLrOauafUfbU2ZxCCPylEN2EJ0EDwww");

// Form Submission
document.getElementById("member-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const member = Object.fromEntries(new FormData(e.target));
        
        // Validate data before submission
        if (!member.name || !member.telephone || !member.location) {
            throw new Error("All fields are required");
        }

        const { data, error } = await supabase.from("members").insert([member]);

        if (error) {
            console.error("Supabase Error:", error);
            throw error;
        }
        
        alert("Member added successfully!");
        e.target.reset();
        await fetchMembers();
    } catch (error) {
        console.error("Error:", error);
        alert(`Error adding member: ${error.message}`);
    }
});

// Fetch Members
async function fetchMembers() {
    try {
        const { data, error } = await supabase.from("members").select();
        
        if (error) {
            console.error("Fetch Error:", error);
            throw error;
        }

        const membersList = document.getElementById("members-list");
        membersList.innerHTML = data
            .map(m => `
                <tr>
                    <td>${m.name || 'N/A'}</td>
                    <td>${m.telephone || 'N/A'}</td>
                    <td>${m.location || 'N/A'}</td>
                </tr>
            `)
            .join("");
    } catch (error) {
        console.error("Unexpected Error:", error);
        alert(`Error fetching members: ${error.message}`);
    }
}

// Initial fetch when page loads
fetchMembers();


// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// // Supabase Config
// const supabase = createClient("https://wtopxfdjnjqwhtqmwnsz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0b3B4ZmRqbmpxd2h0cW13bnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTUzNzQsImV4cCI6MjA1NjYzMTM3NH0.8KI_0-GUraxFYLrOauafUfbU2ZxCCPylEN2EJ0EDwww");

// // Form Submission
// document.getElementById("member-form").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const member = Object.fromEntries(new FormData(e.target));
//     const { error } = await supabase.from("members").insert([member]);

//     if (error) return alert("Error adding member!");
    
//     alert("Member added!");
//     e.target.reset();
//     fetchMembers();
// });

// // Fetch Members
// async function fetchMembers() {
//     const { data, error } = await supabase.from("members").select();
//     if (error) return console.error(error);

//     document.getElementById("members-list").innerHTML = data
//         .map(m => `<tr><td>${m.name}</td><td>${m.telephone}</td><td>${m.location}</td></tr>`)
//         .join("");
// }

// fetchMembers();
