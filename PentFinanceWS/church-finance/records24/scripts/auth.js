import { supabase } from '../../config/supabase.js';

async function login(email, password) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';
    errorEl.style.display = 'none';

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            errorEl.textContent = error.message;
            errorEl.style.display = 'block';
            return;
        }

        localStorage.setItem("session", JSON.stringify(data.session));
        window.location.href = "dashboard.html";
    } catch (err) {
        errorEl.textContent = "Login failed";
        errorEl.style.display = 'block';
    }
}

document.getElementById("login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await login(email, password);
});

// Logout function
document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("session");
    window.location.href = "index.html";
});

// import { supabase } from '../../config/supabase.js';

// async function login(email, password) {
//     const errorEl = document.getElementById('login-error');
//     errorEl.textContent = '';
//     errorEl.style.display = 'none';

//     try {
//         console.log("Login attempt started");
//         const { data, error } = await supabase.auth.signInWithPassword({ 
//             email, 
//             password 
//         });

//         console.log("Supabase response:", { data, error });

//         if (error) {
//             console.error("Supabase Login Error:", error);
//             errorEl.textContent = error.message;
//             errorEl.style.display = 'block';
//             return false;
//         }

//         if (data.session) {
//             console.log("Session created successfully");
//             localStorage.setItem("session", JSON.stringify(data.session));
//             window.location.href = "dashboard.html";
//             return true;
//         } else {
//             console.warn("No session created");
//             errorEl.textContent = "Authentication failed";
//             errorEl.style.display = 'block';
//             return false;
//         }
//     } catch (err) {
//         console.error("Unexpected login error:", err);
//         errorEl.textContent = "Login failed";
//         errorEl.style.display = 'block';
//         return false;
//     }
// }

// document.getElementById("login-form")?.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     await login(email, password);
// });



// import { supabase } from './supabase.js'

// async function login(email, password) {
//     const errorEl = document.getElementById('login-error');
//     errorEl.textContent = '';
//     errorEl.style.display = 'none';

//     try {
//         const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//         if (error) {
//             errorEl.textContent = error.message;
//             errorEl.style.display = 'block';
//             return false;
//         }

//         if (data.session) {
//             localStorage.setItem("session", JSON.stringify(data.session));
//             window.location.href = "dashboard.html";
//             return true;
//         }
//     } catch (err) {
//         errorEl.textContent = "Login failed";
//         errorEl.style.display = 'block';
//         return false;
//     }
// }

// document.getElementById("login-form")?.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     await login(email, password);
// });