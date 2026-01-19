document.addEventListener("DOMContentLoaded", () => {
    loadBooks(1);

    document.getElementById("prevPage").addEventListener("click", () => changePage(-1));
    document.getElementById("nextPage").addEventListener("click", () => changePage(1));

    // Optional: Add event listener for the Reset button to clear search fields
    document.getElementById("resetBtn").addEventListener("click", () => {
        // Reset all search fields dynamically by iterating over them
        resetSearchFields();
        loadBooks(currentPage)
    });
        // Add event listener to Search Button
    document.getElementById("searchBtn").addEventListener("click", () => {
    searchBooksCombined();
    });
    });


    function searchBooksCombined() {
    const qTitle  = document.getElementById("searchTitle").value.trim().toLowerCase();
    const qAuthor = document.getElementById("searchAuthor").value.trim().toLowerCase();
    const qYear   = document.getElementById("searchYear").value.trim().toLowerCase();
    const qIsbn   = document.getElementById("searchISBN").value.trim().toLowerCase();

    const filteredBooks = booksData.filter(book => {
        const title  = (book.title || "").toLowerCase();
        const author = (book.author || "").toLowerCase();
        const year   = String(book.year ?? "").toLowerCase();
        const isbn   = String(book.isbn ?? "").toLowerCase();

        if (qTitle  && !title.includes(qTitle)) return false;
        if (qAuthor && !author.includes(qAuthor)) return false;
        if (qYear   && !year.includes(qYear)) return false;
        if (qIsbn   && !isbn.includes(qIsbn)) return false;
        return true;
    });

    renderBooksList(filteredBooks);
}
    

// Helper function to reset search fields dynamically
function resetSearchFields() {
    const searchFields = ['Title', 'Author', 'Year', 'ISBN'];
    
    searchFields.forEach(field => {
        document.getElementById(`search${field}`).value = '';
    });
}

function renderBooksList(list) {
  const tableBody = document.getElementById("book-table");
  tableBody.innerHTML = "";

  list.forEach(book => {
    let coverPath;

    if (book.coverPath) {
      const relativePath = book.coverPath.replace("/app/hdd/books/", "");
      coverPath = `${basePath}/books/` +
        relativePath.split("/").map(encodeURIComponent).join("/");
    } else {
      coverPath = `${basePath}/images/old-vintage-book-clipart-design-illustration-free-png.png`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="${coverPath}" alt="Cover" width="50"
             onerror="this.src='${basePath}/images/old-vintage-book-clipart-design-illustration-free-png.png'">
      </td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.year || "N/A"}</td>
      <td>${book.categories || "N/A"}</td>
      <td>
        <button class="kindle-btn" data-file="${book.filePath}">📩 Kindle</button>
        <button class="kobo-btn" data-file="${book.filePath}">📩 Kobo</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  attachEventListeners();
}


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const basePath = window.location.pathname.replace(/\/$/, '');

function withBase(path) {
    return `${basePath}${path}`;
}

const booksPerPage = 10;
let currentPage = 1;
let totalBooks = 0;
let booksData = [];

// 📚 Fetch Books with Pagination
async function loadBooks(page = 1) {
  try {
    console.log(`📜 Fetching books for page: ${page}`)
    const response = await fetch(withBase(`/api/books?page=${page}&limit=${booksPerPage}`));
    const data = await response.json();
    booksData = data.books;
    totalBooks = data.total;

    currentPage = page;
    
    renderBooks();
    updatePagination();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

// 🎨 Render Books in Table
function renderBooks() {
    renderBooksList(booksData);
}

// 🔗 Attach Button Listeners
function attachEventListeners() {
    document.querySelectorAll(".kindle-btn").forEach(button =>
        button.addEventListener("click", () => sendToKindle(button.dataset.file))
    );

    document.querySelectorAll(".kobo-btn").forEach(button =>
        button.addEventListener("click", () => sendToKobo(button.dataset.file))
    );
}

// 📩 Send to Kindle
async function sendToKindle(filePath) {
    await fetch("/api/send/kindle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath })
    });
    alert("✅ Sent to Kindle!");
}

// 📩 Send to Kobo
async function sendToKobo(filePath) {
    await fetch("/api/send/kobo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath })
    });
    alert("✅ Sent to Kobo!");
}

// 📄 Pagination Controls
function changePage(direction) {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    const nextPage = currentPage + direction;

    if (nextPage >= 1 && nextPage <= totalPages) {
        currentPage = nextPage;
        loadBooks(currentPage);
        console.log(`➡️ Changing to page ${currentPage}`);

    }
}


function updatePagination() {
    document.getElementById("pageInfo").innerText = `Page ${currentPage}`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage * booksPerPage >= totalBooks;
}
