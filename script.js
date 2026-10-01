document.addEventListener("DOMContentLoaded", function () {

  // ==============================
  // NAVIGATION ACTIVE LINK
  // ==============================

  const currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase() || "index.html";

  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(function (link) {

    const linkPage =
      link.getAttribute("href")
        .split("/")
        .pop()
        .toLowerCase();

    link.classList.remove("active");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }

  });


  // ==============================
  // LOAD ARTICLES AUTOMATICALLY
  // ==============================

  loadArticles();

});


async function loadArticles() {

  try {

    const response = await fetch("articles.json");

    if (!response.ok) {
      throw new Error("articles.json not found");
    }

    const articles = await response.json();

    displayFeaturedArticles(articles);
    displayLatestArticles(articles);

  } catch (error) {

    console.error("Article loading error:", error);

    const featured = document.getElementById("dynamicFeatured");

    if (featured) {
      featured.innerHTML = `
        <div class="featured-loading">
          Unable to load latest articles.
        </div>
      `;
    }

  }

}


// ==============================
// FEATURED ARTICLES
// ==============================

function displayFeaturedArticles(articles) {

  const container =
    document.getElementById("dynamicFeatured");

  if (!container || !articles.length) {
    return;
  }

  const article = articles[0];

  container.innerHTML = `

    <article class="featured-main">

      <div class="tag">
        ${article.category || "LATEST"}
      </div>

      <h3>
        ${article.title || "Latest Article"}
      </h3>

      <p>
        ${article.description || ""}
      </p>

      <a
        href="${article.url || "#"}"
        class="hero-button secondary"
      >
        Read More →
      </a>

    </article>

  `;

}


// ==============================
// LATEST ARTICLES
// ==============================

function displayLatestArticles(articles) {

  const articleContainer =
    document.getElementById("articles");

  if (!articleContainer) {
    return;
  }

  if (!articles.length) {
    return;
  }

  articleContainer.innerHTML = "";

  articles.forEach(function (article) {

    const card = document.createElement("article");

    card.className = "searchable";

    card.setAttribute(
      "data-title",
      article.title || ""
    );

    card.innerHTML = `

      <div class="tag">
        ${article.category || "LATEST"}
      </div>

      <h3>
        ${article.title || "Article"}
      </h3>

      <p>
        ${article.description || ""}
      </p>

      <a href="${article.url || "#"}">
        Read More →
      </a>

    `;

    articleContainer.appendChild(card);

  });

}


// ==============================
// SEARCH ARTICLES
// ==============================

function searchArticles() {

  const input =
    document.getElementById("siteSearch");

  if (!input) {
    return;
  }

  const query =
    input.value.trim().toLowerCase();

  const articles =
    document.querySelectorAll(".searchable");

  articles.forEach(function (article) {

    const title =
      (article.getAttribute("data-title") || "")
        .toLowerCase();

    const content =
      article.innerText.toLowerCase();

    if (
      !query ||
      title.includes(query) ||
      content.includes(query)
    ) {

      article.style.display = "";

    } else {

      article.style.display = "none";

    }

  });

}


// ==============================
// SEARCH BUTTON
// ==============================

document.addEventListener(
  "click",
  function (event) {

    if (
      event.target.closest(
        'button[onclick="searchArticles()"]'
      )
    ) {

      searchArticles();

    }

  }
);


// ==============================
// ENTER KEY SEARCH
// ==============================

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Enter" &&
      document.activeElement &&
      document.activeElement.id === "siteSearch"
    ) {

      searchArticles();

    }

  }
);
