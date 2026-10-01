document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       YOURPRIMEPLUS - MAIN JAVASCRIPT
       ========================================================= */


    /* =========================================================
       1. NAVIGATION ACTIVE LINK
       ========================================================= */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "index.html";

    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(function (link) {

        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        const linkPage =
            href
                .split("/")
                .pop()
                .toLowerCase();

        link.classList.remove("active");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }

    });


    /* =========================================================
       2. LOAD ARTICLES AUTOMATICALLY
       ========================================================= */

    loadArticles();


    /* =========================================================
       3. LOAD ARTICLES FUNCTION
       ========================================================= */

    async function loadArticles() {

        try {

            /*
             * Cache-busting:
             * This prevents GitHub Pages / browser
             * from showing an old articles.json file.
             */

            const jsonURL =
                new URL(
                    "articles.json",
                    window.location.href
                ).href + "?v=" + Date.now();


            const response = await fetch(jsonURL, {
                cache: "no-store"
            });


            if (!response.ok) {
                throw new Error(
                    "articles.json could not be loaded. Status: " +
                    response.status
                );
            }


            const articles = await response.json();


            /*
             * Check JSON format
             */

            if (!Array.isArray(articles)) {
                throw new Error(
                    "articles.json must contain an array."
                );
            }


            console.log(
                "YourPrimePlus: Articles loaded successfully",
                articles
            );


            /*
             * Display articles
             */

            displayFeaturedArticles(articles);

            displayLatestArticles(articles);


        } catch (error) {

            console.error(
                "YourPrimePlus Article Loading Error:",
                error
            );


            /*
             * Featured error
             */

            const featured =
                document.getElementById("dynamicFeatured");

            if (featured) {

                featured.innerHTML = `
                    <div class="featured-loading">
                        Unable to load latest articles.
                    </div>
                `;

            }


            /*
             * Latest articles error
             */

            const articleContainer =
                document.getElementById("articles");

            if (articleContainer) {

                articleContainer.innerHTML = `
                    <div class="featured-loading">
                        Unable to load articles right now.
                        <br>
                        Please refresh the page.
                    </div>
                `;

            }

        }

    }


    /* =========================================================
       4. FEATURED ARTICLE
       ========================================================= */

    function displayFeaturedArticles(articles) {

        const container =
            document.getElementById("dynamicFeatured");


        if (!container) {
            return;
        }


        if (!articles || articles.length === 0) {

            container.innerHTML = `
                <div class="featured-loading">
                    No articles available yet.
                </div>
            `;

            return;
        }


        /*
         * First article becomes featured article.
         */

        const article = articles[0];


        const title =
            escapeHTML(
                article.title ||
                "Latest Article"
            );


        const category =
            escapeHTML(
                article.category ||
                "LATEST"
            );


        const description =
            escapeHTML(
                article.description ||
                "Discover the latest useful information."
            );


        const url =
            safeURL(
                article.url ||
                "#"
            );


        container.innerHTML = `

            <article class="featured-main">

                <div class="tag">
                    ${category}
                </div>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${description}
                </p>

                <a
                    href="${url}"
                    class="hero-button secondary"
                    style="margin-top:20px;width:max-content;"
                >
                    Read More →
                </a>

            </article>

        `;

    }


    /* =========================================================
       5. LATEST ARTICLES
       ========================================================= */

    function displayLatestArticles(articles) {

        const articleContainer =
            document.getElementById("articles");


        if (!articleContainer) {
            return;
        }


        if (!articles || articles.length === 0) {

            articleContainer.innerHTML = `
                <div class="featured-loading">
                    No latest articles available.
                </div>
            `;

            return;
        }


        /*
         * Clear old articles
         */

        articleContainer.innerHTML = "";


        /*
         * Create every article card
         */

        articles.forEach(function (article) {

            const card =
                document.createElement("article");


            /*
             * Required by search function
             */

            card.className = "searchable";


            /*
             * Save title for search
             */

            card.setAttribute(
                "data-title",
                article.title || ""
            );


            const title =
                escapeHTML(
                    article.title ||
                    "Untitled Article"
                );


            const category =
                escapeHTML(
                    article.category ||
                    "LATEST"
                );


            const description =
                escapeHTML(
                    article.description ||
                    ""
                );


            const url =
                safeURL(
                    article.url ||
                    "#"
                );


            /*
             * Article HTML
             */

            card.innerHTML = `

                <div class="tag">
                    ${category}
                </div>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${description}
                </p>

                <a href="${url}">
                    Read More →
                </a>

            `;


            /*
             * Add card to page
             */

            articleContainer.appendChild(card);

        });

    }


    /* =========================================================
       6. SEARCH ARTICLES
       ========================================================= */

    window.searchArticles = function () {

        const input =
            document.getElementById("siteSearch");


        if (!input) {
            return;
        }


        const query =
            input.value
                .trim()
                .toLowerCase();


        const articles =
            document.querySelectorAll(
                ".searchable"
            );


        articles.forEach(function (article) {

            const title =
                (
                    article.getAttribute(
                        "data-title"
                    ) || ""
                ).toLowerCase();


            const content =
                (
                    article.innerText || ""
                ).toLowerCase();


            /*
             * Empty search:
             * Show everything
             */

            if (!query) {

                article.style.display = "";

                return;

            }


            /*
             * Search title/content
             */

            if (
                title.includes(query) ||
                content.includes(query)
            ) {

                article.style.display = "";

            } else {

                article.style.display = "none";

            }

        });

    };


    /* =========================================================
       7. SEARCH BUTTON
       ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    'button[onclick*="searchArticles"]'
                );


            if (button) {

                event.preventDefault();

                window.searchArticles();

            }

        }
    );


    /* =========================================================
       8. ENTER KEY SEARCH
       ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                document.activeElement &&
                document.activeElement.id ===
                "siteSearch"
            ) {

                event.preventDefault();

                window.searchArticles();

            }

        }
    );


    /* =========================================================
       9. SEARCH WHILE TYPING
       ========================================================= */

    const searchInput =
        document.getElementById("siteSearch");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                /*
                 * If search is empty,
                 * show all articles.
                 */

                if (
                    searchInput.value.trim() === ""
                ) {

                    window.searchArticles();

                }

            }
        );

    }


    /* =========================================================
       10. SAFE URL FUNCTION
       ========================================================= */

    function safeURL(url) {

        if (!url) {
            return "#";
        }


        /*
         * Allow normal local pages:
         * technology.html
         * education.html
         * gaming.html
         * updates.html
         */

        if (
            url.startsWith("#") ||
            url.startsWith("./") ||
            url.endsWith(".html")
        ) {

            return escapeAttribute(url);

        }


        /*
         * Allow HTTPS links
         */

        if (
            url.startsWith("https://")
        ) {

            return escapeAttribute(url);

        }


        /*
         * Block unsafe URL formats
         */

        return "#";

    }


    /* =========================================================
       11. HTML ESCAPE
       ========================================================= */

    function escapeHTML(value) {

        if (value === null ||
            value === undefined) {

            return "";

        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================================
       12. ATTRIBUTE ESCAPE
       ========================================================= */

    function escapeAttribute(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    }


    /* =========================================================
       13. AUTO REFRESH
       =========================================================
       
       Every 10 minutes the page checks for new articles.
       User does not need to manually refresh.
       
       ========================================================= */

    setInterval(
        function () {

            loadArticles();

        },
        10 * 60 * 1000
    );


});
