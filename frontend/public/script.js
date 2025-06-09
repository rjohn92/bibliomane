document.addEventListener("DOMContentLoaded", () => {
    loadBooks(1);

    document.getElementById("prevPage").addEventListener("click", () => changePage(-1));
    document.getElementById("nextPage").addEventListener("click", () => changePage(1));

    // Optional: Add event listener for the Reset button to clear search fields
    document.getElementById("resetBtn").addEventListener("click", () => {
        // Reset all search fields dynamically by iterating over them
        resetSearchFields();

        // Optionally, reset the table to show all books again
        const rows = document.querySelectorAll("tbody tr");
        rows.forEach(row => row.style.display = "");
    });
        // Add event listener to Search Button
    document.getElementById("searchBtn").addEventListener("click", () => {
        searchBooks('Title');  // You can choose a default search field or combine multiple fields.
        searchBooks('Author');
        searchBooks('Year');
        searchBooks('ISBN');
    });
});

function searchBooks(type) {
    // Ensure the field exists before trying to access its value
    const searchField = document.getElementById(`search${capitalize(type)}`);
    console.log("Searching for : ")
    // Check if the field exists, otherwise return early
    if (!searchField) {
        console.error(`Search field with id 'search${capitalize(type)}' not found.`);
        return;
    }

    const searchValue = searchField.value.toLowerCase();

    // Filter the books based on the search criteria
    const filteredBooks = booksData.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchValue);
        const authorMatch = book.author.toLowerCase().includes(searchValue);
        const yearMatch = book.year.toString().includes(searchValue);
        const isbnMatch = book.isbn.toLowerCase().includes(searchValue);

        if (type === 'title' && titleMatch) return true;
        if (type === 'author' && authorMatch) return true;
        if (type === 'year' && yearMatch) return true;
        if (type === 'isbn' && isbnMatch) return true;

        return false; // If no match, exclude the book
    });

    // Render the filtered books
    renderFilteredBooks(filteredBooks);
}

// Helper function to reset search fields dynamically
function resetSearchFields() {
    const searchFields = ['Title', 'Author', 'Year', 'ISBN'];
    
    searchFields.forEach(field => {
        document.getElementById(`search${field}`).value = '';
    });
}

function renderFilteredBooks(filteredBooks) {
    const tableBody = document.getElementById("book-table");
    tableBody.innerHTML = ""; // Clear existing rows

    // Loop through the filtered books and add them to the table
    filteredBooks.forEach(book => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>${book.isbn}</td>
            <td>${book.categories}</td>
            <td>
                <button class="kindle-btn" data-file="${book.filePath}">Send to Kindle</button>
                <button class="kobo-btn" data-file="${book.filePath}">Send to Kobo</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
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
