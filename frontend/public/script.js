document.addEventListener("DOMContentLoaded", () => {
    loadBooks(1);
    document.getElementById("search").addEventListener("keyup", searchBooks);
    document.getElementById("prevPage").addEventListener("click", () => changePage(-1));
    document.getElementById("nextPage").addEventListener("click", () => changePage(1));

});

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
    const tableBody = document.getElementById("book-table");
    tableBody.innerHTML = "";

    booksData.forEach(book => {
        let coverPath;

        if (book.coverPath) {
            const relativePath = book.coverPath.replace("/app/hdd/books/", "");
            coverPath = `${basePath}/books/` +
              relativePath
                .split("/")
                .map(segment => encodeURIComponent(segment))
                .join("/");
        } else {
            coverPath = `${basePath}/images/old-vintage-book-clipart-design-illustration-free-png.png`;
        }

    
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${coverPath}" 
                     alt="Cover" width="50" 
                     onerror="this.src='/images/old-vintage-book-clipart-design-illustration-free-png.png'">
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


// 🔍 Search Books
function searchBooks() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    document.querySelectorAll("tbody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(searchValue) ? "" : "none";
    });
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
