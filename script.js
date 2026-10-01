document.addEventListener("DOMContentLoaded", function () {

    // Current page name
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() || "index.html";


    // All navigation links
    const navLinks = document.querySelectorAll("nav a");


    // Check every navigation link
    navLinks.forEach(function (link) {

        const linkPage = link
            .getAttribute("href")
            .split("/")
            .pop()
            .toLowerCase();


        // Remove active class first
        link.classList.remove("active");


        // Add glass active effect
        if (linkPage === currentPage) {
            link.classList.add("active");
        }

    });

});