// Fetch books from the API and display them in the table
async function fetchBooks() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const table = document.getElementById('booksTable');
  const tableBody = table.querySelector('tbody');

  try {
    // Fetch data from the API
    const response = await fetch('/bibliomane/api/books');
    if (!response.ok) throw new Error('Failed to fetch books');

    const books = await response.json();

    // Populate table with books
    books.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.file_name}</td>
        <td>${book.file_path}</td>
        <td>${(book.file_size / 1024).toFixed(2)} KB</td>
        <td>${new Date(book.modified_at).toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });

    // Hide loading message and show table
    loading.style.display = 'none';
    table.style.display = 'table';

  } catch (err) {
    console.error('Error fetching books:', err);

    // Hide loading message and show error
    loading.style.display = 'none';
    error.style.display = 'block';
  }
}

// Fetch books on page load
fetchBooks();