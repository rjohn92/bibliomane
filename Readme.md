# Bibliomane Project - README

## Overview
Bibliomane is a self-hosted solution designed to organize and manage eBooks within your media library. It integrates with your existing Nginx setup to provide a user-friendly, single-page application for viewing, organizing, and sending books to devices like Kindle. The project aims to enhance accessibility while maintaining simplicity and modularity.

---

## Features
- **Single-Page Application (SPA):**
  - Displays the books in your HDD’s 'Books' folder.
  - Simple, easy-to-navigate HTML interface.

- **Integration with Existing Services:**
  - Uses Node.js for the backend.
  - Seamlessly integrates with the Nginx Docker container for a cohesive experience.

- **Send to Kindle:**
  - Allows users to send eBooks to Kindle directly from the application.

- **Modular Architecture:**
  - Ensures easy updates and future enhancements.

---

## System Requirements
1. **Docker:** To run the backend and Nginx containers.
2. **Node.js:** Backend logic for handling eBook database and Kindle interactions.
3. **Calibre (optional):** For eBook management.
4. **PostgreSQL Database:**
   - Stores metadata of the books for faster querying.
   - The database is hosted on the home-server network.

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/bibliomane.git
cd bibliomane
```

### 2. Environment Setup
Create a `.env` file in the project root with the following variables:
```
DATABASE_HOST=your_database_host
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name
BOOKS_FOLDER=/path/to/books
NGINX_CONTAINER_NAME=nginx
```

### 3. Build and Run Containers
Run the following command to bring up the services:
```bash
docker-compose up -d
```

---

## Usage

### Access the Application
1. Open a web browser and navigate to your Nginx domain or IP address.
2. The Bibliomane interface will display your eBooks categorized and ready to interact with.

### Sending Books to Kindle
1. Select an eBook from the list.
2. Enter your Kindle email address.
3. Click the **Send to Kindle** button.

---

## Folder Structure
```
Bibliomane
├── backend
│   ├── app.js
│   ├── routes
│   │   ├── books.js
│   │   └── kindle.js
│   ├── models
│   │   ├── Book.js
│   │   └── Database.js
├── frontend
│   ├── index.html
│   ├── script.js
│   ├── styles.css
├── docker-compose.yml
├── README.md
├── .env
```

---

## Future Enhancements
- Add user authentication with role-based access control.
- Expand compatibility with additional eBook formats.
- Enable detailed statistics and analytics for eBook usage.
- Provide support for tagging and categorizing eBooks.

---

## Contributing
1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Commit your changes.
4. Submit a pull request.

---

