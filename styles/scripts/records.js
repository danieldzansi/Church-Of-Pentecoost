document.getElementById("menuToggle").addEventListener("click", function() {
    document.querySelector(".sidebar").classList.toggle("active");
    document.querySelector(".main-content").classList.toggle("shifted");
});
document.addEventListener("click", function(event) {
    let sidebar = document.querySelector(".sidebar");
    let menuToggle = document.getElementById("menuToggle");
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        sidebar.classList.remove("active");
        document.querySelector(".main-content").classList.remove("shifted");
    }
});

document.querySelectorAll(".year").forEach(year => {
    year.addEventListener("click", function () {
        this.classList.toggle("active"); // Toggle dropdown visibility
    });
});
document.querySelectorAll(".year").forEach(year => {
    year.addEventListener("click", function () {
        document.querySelectorAll(".year").forEach(y => {
            if (y !== this) y.classList.remove("active"); // Close other dropdowns
        });
        this.classList.toggle("active"); // Toggle dropdown visibility
    });
});
